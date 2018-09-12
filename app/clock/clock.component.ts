import { Component, OnInit } from '@angular/core';
import { timer, Subscription } from 'rxjs';
import { TNSPlayer } from 'nativescript-audio';
import { Vibrate } from 'nativescript-vibrate';
import { TimePicker } from 'ui/time-picker';


const zeroTime = new Date(1970, 1, 1, 0, 0, 0, 0).getTime();

@Component({
	moduleId: module.id,
	templateUrl: './clock.component.html',
	styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {
	// states
	endTime: number;
	leftTime: number;
	left: string;
	counting: boolean;
	workTime: boolean;
	progressValue: number;

	timerSubscription: Subscription;
	private _player: TNSPlayer;


	constructor() {

	}

	ngOnInit() {
		this.initAudioPlayer();
		this.workTime = true;
		this.endTime = new Date(1970, 1, 1, 0, parseInt('25'), 0, 0).getTime();
		this.leftTime = this.endTime - zeroTime;
		this.updateLeft(this.leftTime);
		this.reset();
	}

	public start() {
		this.tick();
		this.counting = true;
		this.workTime = true;

		console.log("Started.");
	}

	public stop() {
		this.timerSubscription.unsubscribe();
		this.counting = false;
		this.workTime = false;
		console.log("Stopped.");
	}

	public reset() {
		this.stop();
		this.workTime = true;
		this.leftTime = this.endTime - zeroTime;
		this.updateLeft(this.leftTime);
		console.log("reseted.");
	}

	// recall this method to resume
	private tick() {
		let t = timer(500, 1000);
		this.timerSubscription = t.subscribe(() => this.countDown());
	}

	private countDown() {
		this.leftTime -= 1000;
		this.updateLeft(this.leftTime);
		console.log("counting...");

		if (this.leftTime <= 0) {
			this.notify();

			if (this.workTime) {
				this.endTime = new Date(1970, 1, 1, 0, parseInt('5'), 0, 0).getTime();
				this.leftTime = this.endTime - zeroTime;
			} else {
				this.stop();
			}
		}
	}

	onPickerLoaded(args) {
		let timePicker = <TimePicker>args.object;
		timePicker.hour = 0;
		timePicker.minute = 25;
	}

	onTimeChanged(args) {
		console.log(args.value);
		let timePicker = <TimePicker>args.object;
		if (!this.counting) {
			console.log(timePicker.minute);
			this.endTime = new Date(1970, 1, 1, 0, timePicker.minute, 0, 0).getTime();
			this.leftTime = this.endTime - zeroTime;
			this.updateLeft(this.leftTime);
		}
	}

	notify() {
		// this.togglePlay();
		let vibrator = new Vibrate();
		vibrator.vibrate(2000);
		console.log("Sample Notification!");
	}

	private initAudioPlayer() {
		this._player = new TNSPlayer();
		this._player.debug = true; // set true to enable TNSPlayer console logs for debugging.
		this._player.initFromFile({
			audioFile: '~/audio/song.mp3', // ~ = app directory
			loop: false,
			completeCallback: this._trackComplete.bind(this),
			errorCallback: this._trackError.bind(this)
		}).then(() => {
			this._player.getAudioTrackDuration().then(duration => {
				// iOS: duration is in seconds
				// Android: duration is in milliseconds
				console.log(`song duration:`, duration);
			});
		});
	}

	private togglePlayAudio() {
		if (this._player.isAudioPlaying()) {
			this._player.pause();
		} else {
			this._player.play();
		}
	}

	private _trackComplete(args: any) {
		console.log('reference back to player:', args.player);
		// iOS only: flag indicating if completed succesfully
		console.log('whether song play completed successfully:', args.flag);
	}

	private _trackError(args: any) {
		console.log('reference back to player:', args.player);
		console.log('the error:', args.error);
		// Android only: extra detail on error
		console.log('extra info on the error:', args.extra);
	}

	private updateLeft(leftTime: number) {
		this.left = new Date(zeroTime + leftTime).toString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
	}

}
