
#include "main.h"

int main()
{
#ifdef EMSCRIPTEN
    //read the lecture's name from the Javascript variable x_filename
    
    char* memory = (char*) EM_ASM_INT({
        var x_memory = _malloc(x_filename.length+1);
        writeAsciiToMemory(x_filename, x_memory);
        return x_memory;
    },0);
    filename=memory;
    filename="/"+filename;
    free(memory);
#else
    //TODO: change this to fit your System
    chdir("/home/user/NetBeansProjects/TTTPlayer/emBuild/");
    
    filename=path+"/"+filename+"_a/"+filename;
#endif
    player=new Player(filename);
}
