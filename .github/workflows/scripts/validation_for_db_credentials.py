import pymysql
import sys
import os

try:
 
    project_name = sys.argv[1]
    repo_name = sys.argv[2]
    deployment_status = sys.argv[3]
    branch = sys.argv[4] if len(sys.argv) > 4 else None

    print("Arguments -> project_name: ", project_name, ", repo_name: ", repo_name, ", deployment_status: ", deployment_status, ", branch: ", branch)

    
    mysql_host = os.environ['MYSQL_HOST']
    mysql_user = os.environ['MYSQL_USER']
    mysql_pwd = os.environ['MYSQL_PASSWORD']

    db = pymysql.connect(
        host=mysql_host,
        user=mysql_user,
        password=mysql_pwd
    )
    cursor = db.cursor()

    
    cursor.execute('''CREATE DATABASE IF NOT EXISTS Deployments''')
    cursor.connection.commit()
    cursor.execute('''USE Deployments''')

   
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS deployments(
            id INT AUTO_INCREMENT PRIMARY KEY,
            project_name LONGTEXT,
            repo_name LONGTEXT,
            branch LONGTEXT,
            deployment_status VARCHAR(10),
            deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    
    cursor.execute('''
        INSERT INTO deployments(project_name, repo_name, branch, deployment_status) 
        VALUES (%s, %s, %s, %s)
    ''', (project_name, repo_name, branch, deployment_status))
    db.commit()

    print("Deployment information inserted successfully.")
except pymysql.Error as e:
    print("Error: Database connection issue -", e)