import { execSync } from "child_process";
import fs from "fs";
import path from "path";

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

export function checkUpdate() {
  if (!isGitClone()) {
    console.warn('Không phải là git clone, bỏ qua kiểm tra update');
    return;
  }

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
    const commitList = execSync(`git log HEAD..${remoteName}/Core --oneline`, { encoding: 'utf-8', cwd: localRepoPath });
    
    if (commitList.trim() !== '') {
      console.log('Có các commit sau:');
      console.log(commitList);

      // Hỏi người dùng có muốn pull về không
      const answer = prompt('Bạn có muốn pull về không? (yes/no): ');
      
      if (answer.trim().toLowerCase() === 'yes') {
        // Thực hiện pull về
        execSync('git pull', { stdio: 'inherit', cwd: localRepoPath });
        console.log('Đã pull về thành công.');
      } else {
        console.log('Bỏ qua pull về.');
      }
    } else {
      console.log('Không có commit mới.');
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra và pull:', error);
  }
}