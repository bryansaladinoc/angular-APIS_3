import { Component } from "@angular/core";
import { FilesService } from "./services/files.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	imgParent = "";
	showImg = true;
	imgRta: string = "";

	constructor(private fileService: FilesService) {}

	onLoaded(img: string) {
		console.log("log padre", img);
	}

	toggleImg() {
		this.showImg = !this.showImg;
	}

	downloadPDF() {
		this.fileService
			.getFile(
				"my.pdf",
				"https://young-sands-07814.herokuapp.com/api/files/dummy.pdf",
				"application/pdf",
			)
			.subscribe();
	}

	onUpload(event: Event) {
		const element = event.target as HTMLInputElement;
		const file = element.files?.item(0);
		if (file) {
			this.fileService.uploadFile(file).subscribe((rta) => {
				this.imgRta = rta.location;
			});
		}
	}
}
