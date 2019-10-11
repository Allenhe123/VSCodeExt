#!/usr/bin/python3

# 这个脚本必须与刷机shell脚本一起放在images镜像目录下面 

import subprocess
import sys
import os

def run_shell(shell, pwd):
    cmd = subprocess.Popen(shell, stdin=subprocess.PIPE, stderr=sys.stderr, close_fds=True,
                           stdout=sys.stdout, universal_newlines=True, shell=True, bufsize=1, 
                           cwd=pwd)

    cmd.communicate()
    return cmd.returncode

# xxx.py and xxx.sh must in the same directory
if __name__ == '__main__':
    if (len(sys.argv) < 2):
        print('invalid parameter')
    else:
        pypath = sys.argv[0]
        pathlist = pypath.split('/')
        pwd = pypath.rstrip(pathlist[len(pathlist) - 1])
        pypath = pypath.replace(pathlist[len(pathlist) - 1], 'flash_all_from_bootrom.sh')
    
        cmd = '/bin/bash %s' % (pypath)
        paswd = sys.argv[1]
        print(run_shell('echo %s|sudo -S %s' % (paswd, cmd), pwd))
