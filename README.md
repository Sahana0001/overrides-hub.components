# Upgrading from HubCommon to Hub.Components

### Update your packages

- Add Hub.Components and Hub.Common.Styling to your bower.json.
```
"hub.common.styling": "git@github.com:iQmetrix/Hub.Common.Styling.git#1.x.x",
"hub.components": "git@github.com:iQmetrix/Hub.Components.git#1.x.x",
```
- `bower update`

### Update your code

1. Update your /app/resources/sass/app.scss
```
$hub-resources: "libs/hub.common.styling/";

@import "../../libs/hub.common.styling/sass/base";
@import "../../libs/hub.components/src/resources/sass/hubLayout";
```

You can also bring in optional components from Hub.Components. (see [Hub.Components](https://github.com/iQmetrix/hub.components)
