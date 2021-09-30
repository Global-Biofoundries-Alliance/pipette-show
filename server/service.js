import fs from 'fs';
import md5 from 'md5';

let tempPath = '/srv/pipetteshow/temp';


async function service(request, response)
{			
	//Check for method (save/load)
	console.error('Client requested', request.body.method);

	switch(request.body.method)
	{
		case 'save':
			saveFile(request, response);
		break;

		case 'load':
			loadFile(request, response);
		break;
	}	

	//purge old files
	purgeCache();
}

async function saveFile(request, response)
{
	let filename = request.body.filename, content = request.body.content, ip = request.connection.remoteAddress;	

	try
	{
		//Create hashcode as filename
		let hashCode = md5(filename + '::' + ip);

		//Write content to file
		await fs.promises.writeFile(tempPath + '/' + hashCode, content);

		//Return hashcode
		response.json({state: 1, code: hashCode});
	}
	catch(ex)
	{
		response.json({state: 0});
		console.error('Error writing file', ex);
	}
}

async function loadFile(request, response)
{	
	let code = request.body.code;

	try
	{
		let content = await fs.promises.readFile(tempPath + '/' + code, {encoding: 'UTF-8'});
		response.json({state: 1, content: content});
	}
	catch(ex)
	{
		response.json({state: 0});
		console.error('Error reading file', ex);
	}
}

//Removes files that are older than a week
async function purgeCache() {
  try {
    
  	//Get all temp files
    let files = await fs.promises.readdir(tempPath);
    
    //find and remove the oldest ones
    let promises = [];
    for(let i = 0; i < files.length; i++)
    {   
    	let promise = new Promise(async function(resolve, reject) {
    		let filePath = tempPath + '/' + files[i];
    		let res = await fs.promises.stat(filePath);
    		let lastChanged = res.mtime;
    		
    		if(Date.now() > lastChanged + 1000*60*60*24*7)
    		{
    			await fs.promises.unlink(filePath);
    			console.log('Removed file', filePath);
    		}    		
    	});
    	promises.push(promise);
    }

    //Wait until all promises have finished
    await Promise.all(promises);
    
  } catch (err) {
    console.error('Error occured while reading directory!', err);
  }
}


export default service;
