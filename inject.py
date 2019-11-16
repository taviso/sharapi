import frida
import json
import sys
import subprocess

# send({cmd: "path", params: {start: {x: 1, y: 2, z: 3}, end: {x: 1, y: 2, z: 3}}})

def pathsolver_init():
    global pathsolverready
    while pathsolverready == False:
        line = pathsolver.stdout.readline()
        if line == 'ready\n':
            pathsolverready = True
            break
        else:
            print(line);

def on_message(message, data):
    if message['type'] != 'send':
        return

    cmd = message['payload']['cmd']
    params = message['payload']['params']
    
    if cmd == 'path':
        result="["
        pathsolver_init()
        print("Sending query to pathsolver...")
        pathsolver.stdin.write("start %.0f %.0f %.0f\r\n" % (params['start'][0], params['start'][1], params['start'][2]))
        pathsolver.stdin.write("end %.0f %.0f %.0f\r\n" % (params['end'][0], params['end'][1], params['end'][2]))
        while True:
            path = pathsolver.stdout.readline()
            if path == 'end\n':
                print("Received complete path from pathsolver...")
                if result[-1] == ',':
                    result = result[:-1]
                result+="]"
                script.post(json.loads(result))
                print("Sent result to agent.")
                break
            elif path == '':
                break
            else:
                result+=path
                result+=","

def main(target_processm, scriptdata):
    global session
    global script
    global pathsolver
    global pathsolverready

    pathsolver=subprocess.Popen(["navmesh.exe"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True, bufsize=1)
    pathsolverready=False

    session = frida.attach(target_process)
    session.enable_jit()
    session.enable_debugger()

    data  = open('scriptfile.out.js', 'r', encoding="utf8").read();
    data += scriptdata;

    script = session.create_script(data)
    script.on('message', on_message)
    script.load()

    print("[!] Ctrl+D on UNIX, Ctrl+Z on Windows/cmd.exe to detach from instrumented program.\n\n")

    try:
        sys.stdin.read()
    except KeyboardInterrupt:
        session.detach()

    session.detach()

    print("finished");

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: %s <process name or PID> [scriptfile]" % __file__)
        sys.exit(1)
    if len(sys.argv) == 3:
        scriptdata = open(sys.argv[2], 'r', encoding="utf8").read();
    else:
        scriptdata = '';


    try:
        target_process = int(sys.argv[1])
    except ValueError:
        target_process = sys.argv[1]
    
    main(target_process, scriptdata)

