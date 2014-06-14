
#include "main.h"

extern "C" void set_path(string p)
{
    filename=p;
}

int main()
{
    player=new Player(path.c_str(),filename.c_str());
}
