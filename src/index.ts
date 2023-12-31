import 'console-info'
import 'console-warn'
import 'console-error'

import { fork } from 'child_process';

import path from 'path';
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';

const _1_MINUTE = 60000;
let restartCount = 0;
let startTime = 0;

function main() {
	if(!existsSync('./.temp')) {
		console.info('Không tìm thấy thư mục .temp đang tạo thư mục')
		mkdirSync('./.temp')
	}
	if(!existsSync('./log')) {
		console.info('Không tìm thấy thư mục log đang tạo thư mục')
		mkdirSync('./log')
	}

	console.info('Đang dọn dẹp thư mục .temp')
	const tempFiles = readdirSync('./.temp')
	for (const file of tempFiles) {
		unlinkSync('./.temp/' + file)
	}

	const child = fork("./src/core/index.ts", [], { stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'ipc'] });

	child.on('close', async (code) => {
		if(!code) return
		handleRestartCount();
		if (code !== 0 && restartCount < 5) {
			console.log();
			console.error(`Đã có lỗi :(, mã lỗi là: ${code}`);
			console.info('Khởi động lại...');
			await new Promise(resolve => setTimeout(resolve, 2000));
			main();
		}
		else {
			console.log();
			console.log('Bot has stopped, press Ctrl + C to exit.');
		}
	});

	child.on('message', (message) => {
		if(message == 'restart') {
			console.info('Nhận yêu cầu khởi động lại...');
			child.kill();
			setTimeout(() => main(), 5 * 1000)
		}
	})
}

function handleRestartCount() {
	restartCount++;
	setTimeout(() => {
		restartCount--;
	}, _1_MINUTE);
}

main();