# Setup

## Model Garden Minimal Setup

### Part I. Setup Cloud Account

#### Register Cloud Account

Create AWS account following instructions in
[aws.amazon.com/free](http://aws.amazon.com/free).

More than 5GB free tier S3 bucket storage should be enough for testing purposes.

**NOTE**: If you created already a free tier account couple years ago and it is
suspended (deleted) usually such account can't be restored due to Amazon
service implementation peculiarities. In this case the new account can be
registered for the same email but with appended a plus ("+") sign and any
combination of words or numbers before at ("@") sign (
see [2 hidden ways to get more from your Gmail 
address](http://gmail.googleblog.com/2008/03/2-hidden-ways-to-get-more-from-your.html)
for more details).


#### Activate MFA in Cloud Account

It is recommended to enable
[Multi-factor authentication](http://www.wikipedia.org/wiki/Multi-factor_authentication)
in order to avoid any account data blocking issues: 

* Install on the smart-phone
[Google Authenticator](http://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en),
[Microsoft Authenticator](http://play.google.com/store/apps/details?id=com.azure.authenticator)
or any other MFA mobile application to in order to perform
[Two-factor authentication](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html)
at the AWS account login.

* Open '**[My Security Credentials](http://docs.aws.amazon.com/general/latest/gr/aws-security-credentials.html)**'
from the account menu (having the same name as the created account) in the top
right corner of [console.aws.amazon.com](http://console.aws.amazon.com).

* In the cloud console expand '**[Multi-factor authentication (MFA)](http://aws.amazon.com/iam/features/mfa)**'
section with displayed [QR-code](www.wikipedia.org/wiki/QR_code) and
[scan](http://www.wikipedia.org/wiki/Barcode_Scanner_(application)) it in the
installed MFA mobile application using the smart-phone camera.


#### Create Account Access Key

Access key is needed to 
[Add to Backend .env File](backend/README.md#add-backend-env-file) (see
[backend/README.md](backend/README.md)). This key can be taken from the account
[AWS security credentials](http://docs.aws.amazon.com/general/latest/gr/aws-security-credentials.html):

* Open '**My Security Credentials**' from the account menu (having the same name
as the account) in the top right corner of 
[console.aws.amazon.com](http://console.aws.amazon.com).

* Expand '**[Access keys](http://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html)**'
section and press '**Create New Access Key**'.

* Dump '**Access Key ID**' and the key itself to a safe place.

<table>
  <tr>
    <th style="text-align:center">AWS Parameter</th>
    <th style="text-align:center">Backend Env Variabel</th>
    <th style="text-align:center">Value Example</th>
  </tr>
  <tr>
    <td>AWSAccessKeyId</td>
    <td>AWS_ACCESS_KEY_ID</td>
    <td>ABCDEFGHIJKLMNOPQRST</td>
  </tr>
  <tr>
    <td>AWSSecretKey</td>
    <td>AWS_SECRET_KEY</td>
    <td>abcdefghijklmnopqrstuvwxyz0123456789-+/</td>
  </tr>
</table>


#### Add Cloud Bucket

[Create an S3 Bucket](http://docs.aws.amazon.com/AmazonS3/latest/user-guide/create-bucket.html)
in [s3.console.aws.amazon.com](http://s3.console.aws.amazon.com) with the
following settings and properties:

* Frankfurt **Region** (eu-central-1)

* Blocked *all public access*

* Disabled *Bucket Versioning* and *Encryption*

The recommended bucket name is *model-garden-*<your_initials>.

See more details in the [Setup S3 Bucket](deploy/README.md#setup-s3-bucket)
[Deployment](deploy/README.md) instructions.


#### Setup Content Delivery Network for Bucket Content

[Content delivery network](www.wikipedia.org/wiki/Content_delivery_network)
to reduce a latency of the media content delivery in the frontend pages.
Actually the content can be delivered from S3 bucket directly, but the latency
in this case is at minimum a half of second. At the same time the average CDN
latency fluctuates between 30 and 45 ms (see 
[Benchmarking CDNs: CloudFront, Cloudflare, Fastly, and Google Cloud](www.pingdom.com/blog/benchmarking-cdns-cloudfront-cloudflare-fastly-and-google-cloud/)).

Steps to setup AWS CloudFront CDN:

1. Press '**[Create Distribution](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-creating-console.html)**'
in the AWS **[CloudFront Distributions](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-working-with.html)**
in [console.aws.amazon.com/cloudfront/home](http://console.aws.amazon.com/cloudfront/home).

2. Select **Web** as the delivery method.

3. Specify *model-garden-*<your_initials>.s3.*eu-central-1*.amazonaws.com as a
**[Origin Domain Name](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesDomainName)**
(*model-garden-*<your_initials> is the bucket name and *eu-central-1* is the
bucket **Region** specified at the bucket creation) and leave automatically generated
**[Origin ID](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesId)**
(e.g. S3-*model-garden-*<your_initials>).

    **ATTENTION**: Usually '**Create Distribution**' wizard proposes
*model-garden-*<your_initials>.s3.amazonaws.com as a **Origin Domain Name**.
This option leads to the content access errors. Insert *eu-central-1* **Region**
between s3 and [amazonaws.com](amazon.com) to prevent CDN service from a
redirection to S3 bucket restricted links (see publications about
[AWS CloudFront redirecting to S3 bucket](www.stackoverflow.com/questions/38735306/aws-cloudfront-redirecting-to-s3-bucket)).

4. Leave as default the rest of parameters and press '**Create Distribution**'
at the bottom.

5. Open the newly-created distribution and in
[Origins and Origin Groups](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesTargetOriginId)
tab selecting *model-garden-*<your_initials>.s3.*eu-central-1*.amazonaws.com to
edit this.

6. At *model-garden-*<your_initials>.s3.*eu-central-1*.amazonaws.com editing in
the **Edit Origin** page after clicking at '*Yes*' in **Restrict Bucket Access**
radio buttons the following options should appear and be selected: 
    * Choose '*Create a New Identity*' in
    **[Origin Access Identity](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesOAI)**.
    * Choose '*Yes, Update Bucket Policy*' option in order to
    [grant read permissions on bucket within CloudFront](https://acloud.guru/forums/aws-certified-solutions-architect-associate/discussion/-KaF8wx8WH-hwgkWkoP_/grant-read-permissions-on-bucket-within-cloudfront).

    **NOTE**: By default the cloud bucket doesn't provide content read access to
other cloud services including CDN. '*Yes, Update Bucket Policy*' option is
obligatory to allow such access.

Finally bucket CDN **Domain Name** required by Model Garden admin pages should
appear in **[CloudFront Distributions](http://cconsole.aws.amazon.com/cloudfront/home?distributions)**
table. For instance:
* [https://abc7ah1iunm93.cloudfront.net/](https://abc7ah1iunm93.cloudfront.net/)
* [https://d1l3nuymkh9b8l.cloudfront.net/](https://abc7ah1iunm93.cloudfront.net/)

See more details in
[Create CloudFront Distribution](deploy/README.md#create-cloudfront-distribution)
section of [<model_garden_root>/deploy/README.md](deploy/README.md).


#### Test Access to Bucket Content through CDN

Put a test image to the root of the bucket in order to test CDN setup:

1. Download one of images from [Google Image Search](www.google.com/search?q=cats).

2. Rename the image as *test.jpg* to be short.

3. Open the created bucket root in
[s3.console.aws.amazon.com/s3/buckets/*model-garden-*<your_initials>](http://s3.console.aws.amazon.com/s3/buckets/)
and upload *test.jpg* there (e.g. via drug-n-drop).

4. Open the image using root CDN link (e.g.
[https://dcn7ah1iunm93.cloudfront.net/test.jpg](https://dcn7ah1iunm93.cloudfront.net/test.jpg)).

The *test.jpg* image should appear in the browser.

Try to repeat steps from
[Setup Content Delivery Network](#setup-content-delivery-network-for-bucket-content)
instruction, if you see the
[AccessDenied](http://aws.amazon.com/premiumsupport/knowledge-center/s3-website-cloudfront-error-403/)
error message with the following title:

- *[This XML file does not appear to have any style information associated with
it. The document tree is shown below.](http://www.stackoverflow.com/questions/44741287/cloudfront-error-this-xml-file-does-not-appear-to-have-any-style-information-as)*


#### Results

The cloud account setup should have the following results which are necessary
for [backend](backend/README.md) and [frontend](frontend/README.md) operations:

* Created Account Access Key (and its id).

<table>
  <tr>
    <td style="text-align:center">AWSAccessKeyId</td>
    <td style="text-align:center">AWSSecretKey</td>
  </tr>
  <tr>
    <td style="text-align:center">AWS_ACCESS_KEY_ID</td>
    <td style="text-align:center">AWS_SECRET_KEY</td>
  </tr>
</table>

* Distribution mechanism to display the bucket media files (e.g. images) in
the browser through CDN.
