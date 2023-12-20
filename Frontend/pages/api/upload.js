import multiparty from 'multiparty'
import { RESPONSE_LIMIT_DEFAULT } from 'next/dist/server/api-utils';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'; 
import fs  from 'fs';
import mime from 'mime-types';
import * as Minio from 'minio'

const bucket = 'tuc-eshop'
const minioEndpoint = "localhost";


export default async function handle(req,res) {
    const form = new multiparty.Form();
    const {field, files} = await new Promise((resolve,reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {reject(err);}
            resolve({fields,files});
        });
    });

    const client = new Minio.Client({
        endPoint: minioEndpoint,
        port: 9000,
        useSSL: false,
        accessKey: process.env.MINIO_SERVER_ACCESS_KEY,
        secretKey: process.env.MINIO_SERVER_SECRET_KEY,
      });


    const exists = await client.bucketExists(bucket)

    if (exists) {
    console.log('Bucket ' + bucket + ' exists.')
    }


    const links = [];
    for (const file of files.file){
        const ext = file.originalFilename.split('.').pop();
        const newFilename = Date.now() + '.' + ext;

        const filep = file.path;
        console.log('filepath: ', filep);

        var metaData = {
            'Content-Type':  mime.lookup(file.path),
            'X-Amz-Meta-Testing': 1234,
            example: 5678,
          }

        client.fPutObject(bucket, newFilename, 
            filep, metaData);

        
        const link = `http://localhost:9000/${bucket}/${newFilename}`;;
        links.push(link);
    }
    return res.json({links});
}


export const config = {
    api: {bodyParser: false},
};