const {commands, logger} = require('../eris-core/submodules');
const Path = require('path');
const {URL} = require('url');
const { exec } = require('child_process');

module.exports = {
    name: "addmusic",
    description: "add",
    options: [
        {
            name: "image",
            description: "Add music to the last image posted in this channel",
            type: commands.OptionTypes.SUB_COMMAND,
            options:[
                {
                    name: "imgurl",
                    description: "source image url",
                    type: commands.OptionTypes.STRING,
                    required: true
                },
                {
                    name: "musicurl",
                    description: "Youtube link to the song to add",
                    type: commands.OptionTypes.STRING,
                    required: true
                },
                {
                    name: "start",
                    description: "start point of music clip to add (MM:SS)",
                    type: commands.OptionTypes.STRING,
                    required: false
                },
                {
                    name: "end",
                    description: "end point of music clip to add (MM:SS)",
                    type: commands.OptionTypes.STRING,
                    required: false
                },
                {
                    name: "toptext",
                    description: "top text",
                    type: commands.OptionTypes.STRING,
                    required: false
                },
                {
                    name: "bottomtext",
                    description: "bottom text",
                    type: commands.OptionTypes.STRING,
                    required: false
                }
            ]
        }
    ],
    execute(interaction, client) {
        
        commands.sendPlaceholder(interaction, client);
        switch (interaction.data.options[0].name) {
            case "image":
                handleImage(interaction, client);
                break;
        }
    }
}

async function handleImage(interaction, client) {
    return new Promise(async (resolve, reject) => {
        let options = {};
        interaction.data.options[0].options.forEach(o => options = {...options, [o.name]: o.value});

        const imgurl = options['imgurl'];
        const imageExtension = Path.extname(new URL(imgurl).pathname).split('.')[1];
        const musicurl = options['musicurl'];
        const inPoint = options['start'];
        const outPoint = options['end'];
        const topText = options['toptext'];
        const bottomText = options['bottomtext'];
    
        const padAmount = ((topText != null) + (bottomText != null))*100
        const toptextFilter = `drawtext=text='${topText}':fontsize=32:x=(w-tw)/2:y=50-th/2,`;
        const bottomtextFilter = `drawtext=text='${bottomText}':fontsize=32:x=(w-tw)/2:y=h-50-(th/2),`;
        const filter = `[0:v]pad=ceil(iw/2)*2:ceil(ih/2)*2+${padAmount}:0:${padAmount/2-((bottomText != null)*padAmount/2)+((topText != null)*padAmount/2)}:#FFFFFF@1, ${topText ? toptextFilter:''} ${bottomText ? bottomtextFilter:''} format=rgb24`;

        const clip = `-ss 00:${inPoint}.00 -to 00:${outPoint}.00`;

        exec('rm intermediate/*');
        logger.info('Getting image')
        exec(`curl -o intermediate/src.${imageExtension} ${imgurl}`, (error, stdout, stderr) => {
            if(stderr) {
                logger.error(stderr);
            }
            logger.info('resizing image');
            exec(`magick intermediate/src.${imageExtension} -coalesce -resize 640x -background white -alpha remove -alpha off -layers CompareAny intermediate/int.${imageExtension}`, (error, stdout, stderr) => {
                if(stderr) {
                    logger.error(stderr);
                }
                logger.info('getting music')
                exec(`yt-dlp ${musicurl} --extract-audio --audio-format wav --output intermediate/src.wav`, (error, stdout, stderr) => {
                    if(stderr) {
                        logger.error(stderr);
                    }
                    logger.info('rendering video')    
                    exec(`ffmpeg -y ${imageExtension!='gif'?'-loop 1':'-ignore_loop 0'} -i intermediate/int.${imageExtension} -filter_complex "${filter}" ${(inPoint != null && outPoint != null)?clip:''} -i intermediate/src.wav -shortest -preset veryfast -acodec aac -vcodec libx264 -tune stillimage -pix_fmt rgb24 intermediate/out.mp4`, (error, stdout, stderr) => {
                        if(stderr) {
                            logger.error(stderr);
                        }
                        logger.info('done');
                        commands.sendFollowUpMessage(interaction, client, {files: ["intermediate/out.mp4"]});
                        resolve();
                    });            
                });
            });
        });
    });
}