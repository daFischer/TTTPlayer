
#include "main.h"

int main()
{
#ifdef EMSCRIPTEN
    char* memory = (char*) EM_ASM_INT({
        var x_memory = _malloc(x_filename.length+1); //TODO: Ensure x_filename is ASCII
        writeAsciiToMemory(x_filename, x_memory);
        return x_memory;
    },0);
    filename=memory;
    free(memory);
#endif
    player=new Player(path.c_str(),filename.c_str());
}
