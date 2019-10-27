.PHONY: clean

all: scriptfile.out.js

clean:
	rm -f *.out.js

scriptfile.out.js: tls.js       \
                   symbols.js   \
                   radmath.js   \
                   classes.js   \
                   usercall.js  \
                   main.js
	cat $^ > $@
