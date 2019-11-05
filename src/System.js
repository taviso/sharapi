// This is a minimal SystemJS api emulation for rollup.
//
// The problem is all JavaScript tools want to use module loaders, and in
// our context (a frida module), none of them work. The only options are
// don't use modules and just cat everything together or fake it like this.
//
// I find the benefit of organizing my work into modules too valuable, so
// typescript+rollup+this seems to be the best solution available.
//
// I tried using s.min.js, but it didn't work. Rollup only needs to register
// one thing and I want everything exported by main to be in global, so this
// works fine.

var System = {};
System.register = function(exports, defs) {
    defs(function(name, o) {
        console.log("export", name);
        return global[name] = o;
    }).execute();
}
