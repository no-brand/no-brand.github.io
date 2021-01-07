# Glue & Elasticsearch 연동하기 (하나)
> AWS 인프라 위에서 Elasticsearch(이하 ES) 를 운영하시는 분들 이라면, ES를 이용한 Batch 작업에도 많은 선택지를 놓고 고민하실거라 생각합니다. 그 작업의 복잡도(Complexity)가 얼마나 높은지, 얼마의 주기를 가지고 실행하게 될지, 어떻게 하면 관리는 편해질 수 있는지를  두고 생각하게 될텐데, 그 중 하나의 선택지가 될 수 있는 Glue 를 이용한 활용 예를 기록하려고 합니다.

## 개요
1. Infrastructure Diagram
2. Glue & Elasticsearch (in Private Subnet) 연동하기 (*)
3. Lambda 를 이용한 제어
4. 테라폼 구성 (2-3)
5. Dashboard 를 통한 모니터링

## Infrastructure Diagram
<img src="/files/data/glue-connection-private-vpc.png" width="100%">

## Glue & Elasticsearch (in Private Subnet) 연동하기
> Pyspark 를 이용해서 하나의 Batch(ETL) 작업을 수행 할 예정입니다. ES 에서 데이터를 읽어오고(Extraction), 데이터의 포맷을 변경한 후 (Trasformation), S3 의 특정장소에 저장(Load) 하는 간단한 작업입니다.
 
1. Glue Job 선언하기
   - 준비물
     - IAM role : 최소한의 Permissions 만 부여되도록 설정 **(Todo)**
     - Glue Script & 임시파일이 저장될 S3 경로
       |타입    |저장경로                                                   |
       |--------|-----------------------------------------------------------|
       |Script  |s3://aws-glue-scripts-${account_id}-${region}/${iam_user}  |
       |임시파일|s3://aws-glue-temporary-${account_id}-${region}/${iam_user}|
     - ES 연동을 위한 라이브러리 : elasticsearch-hadoop-${version}.jar
       > https://mvnrepository.com/artifact/org.elasticsearch/elasticsearch-hadoop <br>
       > 다운받은 라이브러리는 S3 에 올려두고, Dependent jars path 에 S3 를 명세하도록 합니다.

   - ES 연동하기
     > '21.1 기준으로 Glue 에서 Elasticsearch 의 데이터를 읽어오는 것이 제공되지 않습니다. 그래서 위 준비물에서 언급한 elasticsearch-hadoop 라이브러리를 사용하려고 합니다. 
       ```python
       # Private VPC 내 ES 데이터를 읽어옵니다
       df = spark.read.format('org.elasticsearch.spark.sql') \
                      .option('es.nodes', ${endpoint}) \
                      .option('es.port', 443) \
                      .option('es.nodes.wan.only', True) \
                      .option('es.net.ssl', True) \
                      .load(${index_name}/${doc_name})
       
       # 데이터를 가공합니다 (생략)
       ...
       
       # 가공한 데이터를 S3 에 저장합니다
       df.write.json(${s3_path})
       ```

2. Glue Connection 선언하기
   > 어떤 경로의 데이터가 필요한지 먼저 정리를 해봅니다. 이 예제의 경우 ES(Private Subnet), S3(VPC endpoint or NAT gateway) (이상 2개) 의 네트워크 연결이 필요합니다.
   - 준비물
     - VPC : ES 와 동일한 VPC 로 설정
     - Subnet : ES 와 동일한 Subnet 로 설정
       > Private Subnet 은 외부 인터넷망이 비활성화 되어있고, S3 접근을 위해서는 NAT gateway 나 VPC endpoint (S3, Gateway) 의 설정이 필요합니다. NAT gateway 의 경우 외부망을 거쳐서 S3 에 접근하게되니 VPC endpoint 를 이용해서 AWS 인프라 내부에서만 동작될 수 있도록 설정하려고 합니다.
       - VPC endpoint
         - Endpoint type : Gateway
         - Service name : com.amazonaws.${region}.s3
       - Subnet 의 Routing Table
         |주소             |타겟        |추가여부          |
         |-----------------|------------|------------------|
         |10.255.0.0/16    |local       |                  |
         |VPC endpoint (S3)| vpce-${id} |<center>+</center>|
     - Security Group : 신규생성 및 연결
       - Glue Connection 에 연결되는 SG
         |타입    |프로토콜|포트 범위|주소      |목적               |추가여부          |
         |--------|--------|---------|----------|-------------------|------------------|
         |inbound |TCP     |0-65535  |self      |self-reference rule|<center>+</center>|
         |outbound|TCP     |0-65535  |self      |self-reference rule|<center>+</center>|
         |outbound|TCP     |443      |vpce-${id}|VPC endpoint (S3)  |<center>+</center>|
         |outbound|TCP     |443      |ES        |Database           |<center>+</center>|
       - Elasticsearch 에 연결되는 SG
         |타입    |프로토콜|포트 범위|주소           |목적|추가여부          |
         |--------|--------|---------|---------------|----|------------------|
         |inbound |TCP     |443      |Glue Connection|ETL |<center>+</center>|

3. 선언된 Glue Job 과 Glue Connection 을 연결해서 Running 을 수행하도록 합니다. 처리된 데이터가 S3 에 적재되는걸 확인 할 수 있습니다.






     

