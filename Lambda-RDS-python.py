import json
import boto3 

rds_client = boto3.client('rds-data')

database_name = 'YOUR DB NAME'
db_cluster_arn = 'YOUR ARN CLUSTER NAME'
db_credentials_secrets_store_arn = 'ARN SECRET'

def lambda_handler(event, context):
    student_id = event['student_id'] 
    response = execute_statement("""select * from students_golfo where id = {student_id}""".format(student_id=student_id))
    
    return response
    
def execute_statement(sql):
    response = rds_client.execute_statement(
        secretArn = db_credentials_secrets_store_arn,
        database = database_name,
        resourceArn = db_cluster_arn,
        sql = sql
        )
    
    return response    
    
   
