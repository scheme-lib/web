
# How to build scheme-lib
 * ## environment:

        Windows.msys2.mingw32



 * ## document-version:

        v0.3



* ## case "Windows NT":



   * ### download "msys2":

        #### case "x64":

            download "msys2-x86_64-xxx.exe" on "http://www.msys2.org/";

        #### case "x86":

            download "msys2-i686-xxx.exe" on "http://www.msys2.org/";

         

   * ### install "msys2":

         see to "http://blog.csdn.net/liyuanbhu/article/details/39397931"

         

   * ### set up mingw32 on msys2

        * #### first

            mingw32_shell.bat  

            pacman --needed -Sy bash pacman pacman-mirrors msys2-runtime  

            exit  

              

            mingw32_shell.bat  

            pacman -Syu  

            pacman -S  base-devel git clang zsh nano  

            pacman -S  mingw-w64-i686-toolchain  

      

      * #### some settings of /home/xx/.zshrc or /home/xx/.bashrc

         export PATH="/mingw32/bin:/mingw32/lib:/mingw32/include:/usr/local/bin:/usr/bin:/bin:/opt/bin"  

         alias msystem="echo $MSYSTEM"  

         alias md='mkdir -p'  

         alias grepi='grep -i --color=no'  

         alias grepci='grepc -i'           

         mdcd(){md $1;cd $1};  

         alias a=alias  

           

         a pms='pm -Ss $1|grepci $1'  

         a pmi='pm -S'  

         a pmr='pm -R'  

         m3head_for_pm=mingw-w64-i686  

         m3pms(){pm -Ss $1|grepi $m3head_for_pm|grepci $1};  

         m3pmi(){pmi  $m3head_for_pm-$*};  

         m3pmr(){pmr  $m3head_for_pm-$*};  

         m3head=mingw32  

         

      * #### third   

        m3pmi ncurses  

        m3pmi openal  

        m3pmi glfw  

        m3pmi freeglut  

        m3pmi nanovg-git  

        m3pmi libwebsockets  

        m3pmi readline  

      

   * ### main:

        * ### [1] 下载

            mingw32_shell.bat  

            cd ~/  

            mdcd repo  

            mdcd github  

            mdcd evilbinary  

            git clone https://github.com/evilbinary/scheme-lib.git  

            cd scheme-lib/        

        

        * ### [2] 修改

            nano makefile  

            #ifeq ($(UNAME_S), MINGW32_NT-6.1)  

            ifneq ($(findstring "MINGW32_NT-", $(UNAME_S)), "")  

            (sav&close nano)  

            [在shell里面 "uname -s" 看看就知道要改成什么了]  



        * ### [3] 修改 简化

            cd lib/  

            nano makefile   

            #### #(1)  

                #ifeq ($(UNAME_S), MINGW32_NT-6.1)  

                ifneq ($(findstring "MINGW32_NT-", $(UNAME_S)), "")  

                  

            #### #(2)  

                #LIBS_ALL= libscm.so libimgui.so libglfw.so libffi.so libgles.so libnanovg.so \  

                #libalut.so libgui.so libsocket.so libc.so  

                LIBS_ALL= libscm.so libc.so  

                (sav&clos nano)  



        * ### [4] 复制, 然后make

            cp -r platform/windows/.  .  

              

            cd ..  

            make clean &make  

            (ok!)  

            #测试  

            cp lib/scheme/scheme.exe bin/scheme.exe

            ./scheme  

            ctrl+c  

            

        * ### [4.1] 

            nano scheme-lib/makefile  

            LIBS_ALL=libscm.so libimgui.so libglfw.so libffi.so libgles.so libnanovg.so \  

            libalut.so libgui.so libsocket.so libc.so  

            #逐一增加进LIBS_ALL然后make:  

            #### #(1)

                如果缺少xx.dll  

                就进修改lib/xx/makefile:  

                ifneq ($(findstring "MINGW32_NT-", $(UNAME_S)), "")  

            #### #(2)

                (1)失败 就 直接把x.so 文件 改成x.dll

            #### #(3)

                增加 libalut.so 后, (2)也失败  

                需要把scheme-lib-2.0-win32/bin/libalut.dll 放到 lib/libalut/ 中,  

                然后 make  

                (ok了)



        * ### [4.2]

            在lib/libalut/里:    

                ren makefile makefile.ori  

                echo all:>makefile  

                echo clean:>>makefile

)
