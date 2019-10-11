#!/usr/bin/python3

# 这个脚本必须与固件文件放在同一个目录下面 

import subprocess
import sys
import os

def run_shell(shell, pwd):
    cmd = subprocess.Popen(shell, stdin=subprocess.PIPE, stderr=sys.stderr, close_fds=True,
                           stdout=sys.stdout, universal_newlines=True, shell=True, bufsize=1, 
                           cwd=pwd)

    cmd.communicate()
    return cmd.returncode

if __name__ == '__main__':
    if (len(sys.argv) < 1):
        print('invalid parameter')
    else:
        pypath = sys.argv[0]
        pathlist = pypath.split('/')
        pwd = pypath.rstrip(pathlist[len(pathlist) - 1])
    
        cmd = 'adb push %sai_bstn_dsp_rt.bin /vendor/firmware/' % (pwd)
        print(cmd)
        print(run_shell(cmd, pwd))
