<div align="center"><img src="https://es.wiki.elvenar.com/images/0/04/Glossy_Garden.png" width="50%"/></div>

<div align="center"><h2>🏷️ Model Garden</h2></div>

## Deployment

### Standard Deployment Procedure

#### AWS S2 Bucket and CDN configuration

Please find information [there](https://kb.epam.com/display/EPMCMLCV/AWS+Bucket+Typical+Setup).


### Image Build Pipeline on Gitlab


Gitlab pipeline uses `.gitlab-ci.yml` file for pipeline configuration. The build pipeline is started automatically after commits to **main** and **develop** branches.


### Additional Tags for Deployment

The tag can be added to the build, but not required.

#### Check Existing Tags
```
$ git tag
v0.0.1
```

#### Create New Tag
```
$ git tag -a v0.0.2 -m "v0.0.2"
```

#### Push New Tag
```
$ git push origin v0.0.2
```

#### Check Gitlab Pipelines:

A new pipeline run should be created [here](https://git.epam.com/epmc-mlcv/model_garden/pipelines).

Once the run is completed successfully a new docker image will be available in [Amazon ECR repository](https://eu-central-1.console.aws.amazon.com/ecr/repositories/model_garden_backend/?region=eu-central-1).