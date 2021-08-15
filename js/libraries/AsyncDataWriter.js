export class AsyncDataWriter {
    async post(filePath, data, headers = {'Content-Type': 'application/json'}) {
		let response = await fetch(filePath, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(data)
		  });
		return response.json();
	}
}