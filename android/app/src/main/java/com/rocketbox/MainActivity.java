package com.rocketbox;

import java.util.List;
import java.util.Arrays;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactActivity;
import com.rnfs.RNFSPackage;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "RocketBox";
  }
  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
      new MainReactPackage(), // <---- add comma
      new RNFSPackage() // <---------- add package
    );
  }
}
