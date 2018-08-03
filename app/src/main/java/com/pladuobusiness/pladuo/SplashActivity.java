package com.pladuobusiness.pladuo;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

public class SplashActivity extends Activity{

    @Override
    protected void onCreate(Bundle saveInstanceState){
        super.onCreate(saveInstanceState);

//        try{
//            Thread.sleep(4000);
//        }catch(InterruptedException e){
//            e.printStackTrace();
//        }
        Intent intent = new Intent(this, MainActivity.class);
        intent.putExtra("state", "launch");
        startActivity(intent);
//       startActivity(new Intent(this,MainActivity.class));
        finish();
    }

}