# queue_info
function qi (){
    sinfo -o "%n %e %m %a %c %C"|column -t
}
# queue job
function qj (){
    squeue -o "%i %P %j %u %T %M %l %D %S %R %Z %o %N"|column -t
}
