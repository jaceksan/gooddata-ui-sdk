# GoodData.UI SDK

## Status

This repository contains the beta version of the upcoming 8.0.0 release of GoodData.UI SDK. While the beta version is
at this point 99% feature-complete it is still undergoing testing and there are known defects. It is not suitable for
production use. The exported APIs are still subject to breaking changes even if they are marked as public.

## Getting Started

The easiest way to start developing analytical applications using GoodData.UI SDK is to use
the [Accelerator Toolkit for v8](https://github.com/gooddata/gooddata-create-gooddata-react-app/tree/sdk8). You will
be up and running in minutes.

For detailed description of available components and capabilities see the [official documentation](https://sdk.gooddata.com/gooddata-ui/docs/about_gooddataui.html).

You can also register to our [live examples](https://gooddata-examples.herokuapp.com/login) and then start the live examples
[application locally](examples/sdk-examples).

## Contributing

### Getting started

1.  Install nvm; for instance: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`
2.  Clone and bootstrap

    ```bash
    git clone git@github.com:gooddata/gooddata-ui-sdk.git
    cd gooddata-ui-sdk
    nvm install
    nvm use
    npm i -g @microsoft/rush pnpm
    rush install
    ```

3.  Build: `rush build`

### After you pull latest changes

Always run `rush install`; this will make sure all the dependencies from the lock file will be installed in all
the projects managed in the repository. After that run `rush build`.

In case the pull brings in new projects or large bulk of changes, it is safer (albeit more time-consuming) to run
`rush install && rush link --force && rush clean && rush rebuild`.

> You can find more technical information in [contributor manual](./docs/contributing.md) and in [developer guide](./docs/sdk-dev.md).

## License

(C) 2017-2020 GoodData Corporation

This project is under commercial license. See [LICENSE](LICENSE).
