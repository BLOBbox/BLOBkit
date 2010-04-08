var blobkitEndTime = new Date();

try {
	tvblob.logInfo("BLOBkit version %%VERSION%% - Exec time: " + (blobkitEndTime - blobkitStartTime) + "ms");
	delete blobkitStartTime;
	delete blobkitEndTime;
} catch (e) {}
