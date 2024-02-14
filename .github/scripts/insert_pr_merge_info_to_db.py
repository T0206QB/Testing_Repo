import pymysql, sys, os

project_name = sys.argv[1]
repo_name = sys.argv[2]
deployment_status = sys.argv[3]
branch = sys.argv[4] if len(sys.argv) > 4 else None

print("Arguments -> project_name : ",project_name," , repo_name : ",repo_name," , deployment_status : ", deployment_status, " , branch : ",branch)

# Retrieve MYSQL credentials and region from environment variables
mysql_host = os.environ['MYSQL_HOST']
mysql_user = os.environ['MYSQL_USER']
mysql_pwd = os.environ['MYSQL_PASSWORD']

db = pymysql.connect(
    host=mysql_host,
    user=mysql_user,
    password=mysql_pwd
    )
cursor = db.cursor()

# CREATING DATABASE in mysql if it doesnt exist
sql_command = '''CREATE DATABASE IF NOT EXISTS Deployments'''
cursor.execute(sql_command)
cursor.connection.commit()

sql_command = '''USE Deployments'''
cursor.execute(sql_command)

# CREATING TABLE in mysql if it doesnt exist
sql_command = '''
    CREATE TABLE IF NOT EXISTS deployments(
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_name LONGTEXT,
        repo_name LONGTEXT,
        branch LONGTEXT,
        deployment_status VARCHAR(10),
        deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
'''
cursor.execute(sql_command)

#INSERTING 1 ROW in the table
sql_command = '''
    INSERT INTO deployments(project_name, repo_name, branch, deployment_status) 
    VALUES ('%s', '%s', '%s', '%s')''' %(project_name,repo_name,branch,deployment_status)
print("SQL Command : ",sql_command)
cursor.execute(sql_command)
db.commit()
