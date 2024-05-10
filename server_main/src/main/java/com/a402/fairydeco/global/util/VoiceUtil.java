package com.a402.fairydeco.global.util;

import com.mpatric.mp3agic.ID3v2;
import com.mpatric.mp3agic.InvalidDataException;
import com.mpatric.mp3agic.Mp3File;
import com.mpatric.mp3agic.UnsupportedTagException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Date;

@Component
public class VoiceUtil {

  @Value("${naver.clova.client-id}")
  private String clientId;

  @Value("${naver.clova.client-secret}")
  private String clientSecret;

  @Value("${naver.clova.url}")
  private String apiURL;

  public File createVoice(String text) {

    File f = null;

    try {

      text = URLEncoder.encode(text, "UTF-8");
      URL url = new URL(apiURL);
      HttpURLConnection con = (HttpURLConnection)url.openConnection();
      con.setRequestMethod("POST");
      con.setRequestProperty("X-NCP-APIGW-API-KEY-ID", clientId);
      con.setRequestProperty("X-NCP-APIGW-API-KEY", clientSecret);
      // post request
      String postParams = "speaker=dara-danna&volume=0&speed=0&pitch=0&format=mp3&emotion=2&emotion-strength=2&alpha=3&end-pitch=-5&text=" + text;
      con.setDoOutput(true);
      DataOutputStream wr = new DataOutputStream(con.getOutputStream());
      wr.writeBytes(postParams);
      wr.flush();
      wr.close();
      int responseCode = con.getResponseCode();
      BufferedReader br;
      if(responseCode==200) { // 정상 호출
        InputStream is = con.getInputStream();
        int read = 0;
        byte[] bytes = new byte[1024];
        // 랜덤한 이름으로 mp3 파일 생성
        String tempname = Long.valueOf(new Date().getTime()).toString();
        f = new File(tempname + ".mp3");
        f.createNewFile();
        OutputStream outputStream = new FileOutputStream(f);
        while ((read =is.read(bytes)) != -1) {
          outputStream.write(bytes, 0, read);
        }
        is.close();
        return f;
      } else {  // 오류 발생
        br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();
        while ((inputLine = br.readLine()) != null) {
          response.append(inputLine);
        }
        br.close();
      }
    } catch (Exception e) {
    }

    return f;
  }

  public int getVoiceDuration(File mp3File) {

    int trackLength = 0;

    try {
      Mp3File mp3 = new Mp3File(mp3File);
      if (mp3.hasId3v2Tag()) {
        ID3v2 id3v2Tag = mp3.getId3v2Tag();
        String artist = id3v2Tag.getArtist();
        String title = id3v2Tag.getTitle();
        String album = id3v2Tag.getAlbum();
        trackLength = (int) mp3.getLengthInSeconds();

        return trackLength;
      } else {
        System.out.println("No ID3v2 tag found.");
      }
    } catch (IOException | UnsupportedTagException | InvalidDataException e) {
      e.printStackTrace();
    }

    return 0;
  }
}