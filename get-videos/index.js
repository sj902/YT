const {
    createClient
} = require('pexels');
const fs = require('fs');
const axios = require('axios');

// const client = createClient('563492ad6f91700001000001e6e009f6be3d4995ac8f829a87ca99e1');
const client = createClient('563492ad6f917000010000013734a1a3a3914d87992ea642b8c3006a');

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max) + 1;
}

const download = (url, filename, callback) => {
    axios({
        url,
        responseType: 'stream',
    }).then(
        response =>
        new Promise((resolve, reject) => {
            response.data
                .pipe(fs.createWriteStream(filename))
                .on('finish', () => resolve())
                .on('error', e => reject(e));
        }),
    );
}

let count = 0;

let page = getRandomInt(10);

const tags = ["bikini", "lingerie", "swimsuit"];
const query = tags[Math.floor(Math.random() * tags.length)];

console.log(query)

function getVideos(page, callback){
        client.videos.search({
            query: query,
            per_page: 10,
            page: page,
            orientation: 'portrait'
        }).then(videos => {
            videos.videos.forEach((video, idx) => {

                const id = video.id;
                const filename = `../video/${bikini}-swimsuit-girl-${idx}-${Math.floor(Math.random() * 10000)}.mp4`;
                const video_files = video.video_files;
                const video_file = video_files.reduce((a, b) => a.height > b.height ? a : b);
                const uri = video_file.link;

                if (video_file.height > video_file.width) {
                    console.log(uri)
                    count = count + 1;
                    download(uri, filename, () => {
                        console.log(`\n ${filename}`)
                    });
                }
            })
        });

}

getVideos(page, getVideos)
