## RUN WEB VERSION

The best for MacOS users is to isntall Kitematic 
Open Kitematic and click Docker CLI
```bash
docker-compose build 
docker-compose up
```

Now your page should be accessable like that: 
[http://192.168.99.100:3001](http://192.168.99.100:3001)

To check your virtual machine IP you can run 
```bash
docker-machine ip
```

## RUN MOBILE VERSION

```bash
react-native run-ios
```


# Using Storybooks

Storybooks allows to work on component in isolation, without running the app. It helps when you work on something hidden deep in the app.

Definitions of the stories are in the Components folder, in Stories subfolder
They should be structured with the name ComponentName.(web|mob).stories.js

On mobile to refresh the list of stories you need to run command
```bash
npm run prestorybook
```
This will update the file storybook/storyLoader.js which must be commited

## WEB
```bash
npm run storybook
```
and then open the web browser [http://localhost:6006/](http://localhost:6006/)


## MOBILE
UNCOMMENT CODE in index.ios.js or index.android.js to return Storybook view 



```bash
npm run storybook:mob
```

and then open the web browser [http://localhost:7007/](http://localhost:7007/)
and in the second terminal run the app. For example 
```bash
react-native run-ios
```

