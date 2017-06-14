# git
- git help
- git config
    + 用户配置
    + git config --global user.name 'coolfe'
    + git config --global user.email ''
    + 配置级别
    + --logal 默认最高，只影响本仓库 .git/config
    + --global 中优先级， 影响到当前用户的所有仓库 ~/.git/config
    + --system 低优先级，影响全系统的仓库 ~/etc/gitconfig
- git init
- git status
    + 未跟踪 跟踪
- git add
    + 工作目录 => 暂存区
    + 未跟踪 => 跟踪
- gitignore
    + 未跟踪文件添加成忽略文件
- git rm 
    + git rm --cached // 从暂存区删除
    + git rum // 暂存区和工作目录删除
- git commit 
    + git commit  -a -m 'text' // 直接提交
- git log 
- **git config alias.shortname <fullcommand>**
    + git config --global alias.lg 'log --color --graph --'
- git diff 工作目录和暂存区的差异
    + git diff -cached // 暂存区与某次提交的差异，默认 HEAD
- git checkout -- <file>  撤销本地修改
    + 暂存区恢复到工作目录
- git reset HEAD <file> //撤销暂存区内容
    + 暂存区恢复到上次提交
- git checkout HEAD -- <file>
    + 工作区恢复到上次提交


# 分支操作
- git branch <name> //创建分支 
- git branch -v // 所有的分支名称
- git branch -d <name> // 删除分支
- git checkout 移动 HEAH 切换分支
-  git checkout  -b <name> // 直接新建一个分支并切换
-  git checkout - // 恢复到上一个分支
- git reset // 当前分支回退到历史版本
    +  git reset --soft // 当前内容复制到暂存区
    +  git reset --hard // 当前内容复制到暂存区和工作目录
- git reflog
- A ^ | A~1 : A 上的父提交
-  A~n：A之前的第 n 次提交

- git stash // 保存当前的工作目录和暂存区状态，并返回干净的工作空间
    +  git stash save 'text' //保存
    +   git stash list 
    +   git stash apply // 恢复
    +    git stash drop stash@{0} //删除
    +    git stash pop = stash apply + stash drop

- git rebase 

## 远程分支
- git push
- git remote origin name 
- git remote -v // 查看远程仓库信息
- git fetch // 获取远程仓库的提交历史


















