import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import inquirer from 'inquirer';
import botConfig from "../../../bot.config.js";

const localRepoPath = './';  // Đường dẫn đến thư mục của dự án
const remoteName = 'public';
const remoteUrl = 'https://github.com/Dino-VN/Messenger-Bot-DinoVN.git';

function isGitClone() {
  return fs.existsSync(path.join(localRepoPath, '.git'));
}

function addGitRemote() {
  try {
    // Thêm remote repository nếu chưa có
    execSync(`git remote add ${remoteName} ${remoteUrl}`, { stdio: 'inherit', cwd: localRepoPath });
    console.info(`Đã thêm public repo vào .git/config`);
  } catch (error) {
    console.error('Lỗi khi thêm remote:', error);
  }
}

function updatePackage(callback: Function) {
  if (fs.existsSync(path.join(localRepoPath, 'pnpm-lock.yaml'))) {
    console.info('Đang cài đặt các package mới...');
    execSync('pnpm install', { stdio: 'inherit', cwd: localRepoPath });
  } else if (fs.existsSync(path.join(localRepoPath, 'yarn.lock'))) {
    console.info('Đang cài đặt các package mới...');
    execSync('yarn install', { stdio: 'inherit', cwd: localRepoPath });
  } else {
    console.info('Đang cài đặt các package mới...');
    execSync('npm install', { stdio: 'inherit', cwd: localRepoPath });
  }
  if (process.send) process.send("restart")
  callback();
}

function updateBot(callback: Function) {
  try {
    execSync('git pull public Core', { stdio: 'inherit', cwd: localRepoPath });
    console.info('Đã tải về update thành công.');
    updatePackage(callback);
  } catch (error) {
    console.error('Lỗi khi khi update hãy update thủ công:', error);
    callback();
  }
}

export function checkUpdate(callback: Function) {
    if (!isGitClone()) {
      console.warn('Không phải là git clone, bỏ qua kiểm tra update');
      callback();
      return;
    } else console.info("Đang kiểm tra update");

    // Kiểm tra xem remote đã được thêm chưa
    const remoteList = execSync('git remote', { encoding: 'utf-8', cwd: localRepoPath }).trim().split('\n');

    if (!remoteList.includes(remoteName)) {
      // console.log(`Remote '${remoteName}' chưa được thêm.`);
      addGitRemote();
    }

    try {
      // Lấy danh sách commit mới từ remote repository
      execSync(`git remote prune ${remoteName}`, { stdio: 'inherit', cwd: localRepoPath });
      execSync(`git fetch ${remoteName}`, { stdio: 'inherit', cwd: localRepoPath });

      // Xem danh sách commit mới
      const commitList = execSync(`git log HEAD..public/Core --pretty=format:"%C(auto)%h %Cgreen%s%Creset"`, { encoding: 'utf-8', cwd: localRepoPath });

      if (commitList.trim() !== '') {
        console.info('Có các commit sau:');
        console.log(commitList);

        if (botConfig.AUTO_UPDATE) updateBot(callback);
        else {
          // Hỏi người dùng có muốn pull về không
          const prompt = inquirer.createPromptModule();

          prompt({
            type: 'confirm',
            name: 'confirm',
            message: 'Bạn có muốn update đoạn code mới nhất từ public repo không?',
            default: false,
          }).then(answer => {
            // console.log(answer);

            if (answer.confirm) {
              // Thực hiện pull về
              updateBot(callback);
            } else {
              console.info('Bỏ qua update.');
              callback();
            }
          })
        }
      } else {
        console.info('Không có update mới.');
        callback();
      }
    } catch (error) {
      console.error('Lỗi khi update:', error);
      callback();
    }
}