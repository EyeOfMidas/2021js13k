export class AsyncDataReader {
    async readText(filePath, headers) {
		let fetchOptions = {method: 'GET'};
		if(headers) {
			fetchOptions.headers = headers;
		}
		let response = await fetch(filePath, fetchOptions);
		return response.text();
	}

    async readJson(filePath, headers) {
		let fetchOptions = {method: 'GET'};
		if(headers) {
			fetchOptions.headers = headers;
		}
		let response = await fetch(filePath, fetchOptions);
		return response.json();
	}

    async readDOM(filePath, headers) {
		let text = await this.readText(filePath, headers);
		return new DOMParser().parseFromString(text, "text/html").body.firstChild;
	}

	async readXML(filePath, headers) {
		let xml = await this.readText(filePath, headers);
		return new DOMParser().parseFromString(xml, "application/xml");
	}
}