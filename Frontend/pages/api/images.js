import multiparty from 'multiparty'
import { RESPONSE_LIMIT_DEFAULT } from 'next/dist/server/api-utils';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'; 
import fs  from 'fs';
import mime from 'mime-types';
import * as Minio from 'minio'

const bucket = 'tuc-eshop'
const minioEndpoint = "172.17.0.1";


export default async function handle(req,res) {
    const {method} = req;
    const client = new Minio.Client({
        endPoint: minioEndpoint,
        port: 9000,
        useSSL: false,
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
    });
    
    
    const exists = await client.bucketExists(bucket)
    if (exists) {
    //console.log('Bucket ' + bucket + ' exists.')
    } else {
        //console.log("No bucket found");
    }


    if (method==='POST' && exists) {
        const form = new multiparty.Form();
        const {field, files} = await new Promise((resolve,reject) => {
            form.parse(req, async (err, fields, files) => {
                if (err) {reject(err);}
                resolve({fields,files});
            });
        });

        const links = [];
        for (const file of files.file){
            const ext = file.originalFilename.split('.').pop();
            const newFilename = Date.now() + '.' + ext;

            const filep = file.path;
            //console.log('filepath: ', filep);

            var metaData = {
                'Content-Type':  mime.lookup(file.path),
                'X-Amz-Meta-Testing': 1234,
                example: 5678,
            }

            await client.fPutObject(bucket, newFilename, 
                filep, metaData);

            
            const link = `http://34.116.170.68/:9000/${bucket}/${newFilename}`;
            links.push(link);
        }
        return res.json({links});
    }

    if (method==='DELETE' && exists) {
        const image = req.query?.image;
        const parts = image.split('/');
        const objectKey= parts[parts.length - 1];
        await client.removeObject(bucket, objectKey);
        return res.json('ok');
    }

    return res.json('erros');
}


export const config = {
    api: {bodyParser: false},
};