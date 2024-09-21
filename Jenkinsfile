pipeline {
    agent any

    environment {
        // Access Jenkins credentials (e.g., secret environment variables)
        DB_USERNAME = credentials('db_username')
        DB_HOST = credentials('db_host')
        DB_NAME = credentials('db_name')
        DB_LOG = credentials('db_log')
        DB_PORT = credentials('db_port')
        APP_SECRET = credentials('app_secret')
        APP_PORT = credentials('app_port')
        DB_PASSWORD = credentials('db_pass')
        USER_KEY_SECRET = credentials('user_key_secret')
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Pull the code from the Git repository
                git branch: 'master', url: 'https://github.com/nur-wahid123/nest-pos-be.git'
            }
        }
        
        
        stage('Create .env File') {
            steps {
                script {
                    // Create .env file with the credentials and other environment variables
                    writeFile file: '.env', text: """
                        DB_USERNAME =${DB_USERNAME}
                        DB_HOST = ${DB_HOST}
                        DB_NAME = ${DB_NAME}
                        DB_LOG = ${DB_LOG}
                        DB_PORT = ${DB_PORT}
                        APP_SECRET = ${APP_SECRET}
                        APP_PORT = ${APP_PORT}
                        DB_PASSWORD = ${DB-PASSWORD}
                        USER_KEY_SECRET = ${USER_KEY_SECRET}
                    """
                }
            }
        }

        stage('Build') {
            steps {
                // Add build steps here (e.g., running tests, building artifacts, etc.)
                echo 'Building...'
                sh 'sudo docker ps'
                sh 'sudo docker-compose up -d --build'
            }
        }

        stage('Deploy') {
            steps {
                // Add deployment steps here
                echo 'Deploying...'
                sh 'sudo docker image prune -f'
            }
        }
    }
}
