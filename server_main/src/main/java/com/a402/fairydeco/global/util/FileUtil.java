package com.a402.fairydeco.global.util;

import org.springframework.stereotype.Component;

@Component
public class FileUtil {

//  @Autowired
//  AmazonS3Client amazonS3Client;
//
//  @Value("${cloud.aws.s3.bucket}")
//  private String bucket;
//
//  @Value("${cloud.aws.s3.base-url}")
//  private String baseUrl;
//
//  public String uploadFile(MultipartFile file) {
//
//    try {
//      String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
//      ObjectMetadata metadata = new ObjectMetadata();
//      metadata.setContentType(file.getContentType());
//      metadata.setContentLength(file.getSize());
//
//      PutObjectRequest putObjectRequest = new PutObjectRequest(
//          bucket, fileName, file.getInputStream(), metadata
//      );
//      putObjectRequest.withCannedAcl(CannedAccessControlList.PublicRead);
//      amazonS3Client.putObject(putObjectRequest);
//      return baseUrl + fileName;
//    } catch (IOException e) {
//    }
//    return null;
//  }
//
//  public void deleteFile(String fileName) {
//    try {
//      amazonS3Client.deleteObject(bucket, fileName);
//    } catch (AmazonServiceException e) {
//      // Handle exception
//    }
//  }
}
