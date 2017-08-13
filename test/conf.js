exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
   onPrepare: function() {
     browser.driver.manage().window().setSize(1600, 800);
  },
  params:
  {
    homepage : 'http://localhost:1337/',
    fblogin : function()
    {
         browser.getAllWindowHandles().then(function(handles){
          if(handles.length>1)
          {
            browser.switchTo().window(handles[1]);
            var em = browser.driver.findElement(By.id("email"));
            em.sendKeys("nyryypx_smithsen_1460292760@tfbnw.net");
            browser.driver.findElement(By.id("pass")).sendKeys("{{FACEBOOK PASSWORD}}");
            em.submit().then(function(){
              browser.switchTo().window(handles[0]).then(function(){
                var loggedin = element(by.id("loggedin"));
               // expect(loggedin.isDisplayed()).toEqual(true);
              });
            });
            browser.sleep(1500);
          }
       });
     }
    },
  specs: ['test-circle-creation.js']//,'test-homepage.js']
};
