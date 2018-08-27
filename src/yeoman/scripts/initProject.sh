#!/usr/bin/expect -f
set timeout -1
set route [lindex $argv 0]
cd $route
spawn yo rest
expect {
    "*What's the project name?" { send -- "\r" }
}
expect {
    "*Where to put the source code?" { send -- "\r" }
}
expect {
    "*Where to put the API code (inside ./src)?" { send -- "\r" }
}
expect {
    "*Do you want to force SSL in production mode?" { send -- "n\r" }
}
expect {
    "*Do you want to generate authentication API?" { send -- "n\r" }
}
expect eof