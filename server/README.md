# Server

All assets needed by the Raspberry Pi should be here. We should be able to copy this directory
onto the Raspberry Pi and just type "npm start"

This reposity has some very deep nested filenames. To enable these with Git/Windows:

In the windows registry, navigate to HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem.
Find "LongPathsEnabled" and set it to 1.

For Git, enter the command: `git config core.longpaths true`

