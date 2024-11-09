pipeline {
    agent any

    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/nur-wahid123/nest-pos-be.git'
            }
        }
        
        stage('Use Secret File') {
            steps {
                withCredentials([file(credentialsId: 'env_file', variable: 'ENV_FILE')]) {

                        sh 'rm -f .env'

                        // Use absolute paths for copying the file
                        sh "cp $ENV_FILE '$WORKSPACE/.env'"
                }
            }
        }
        

        stage('Build') {
            steps {
                // Add build steps here (e.g., running tests, building artifacts, etc.)
                echo 'Building...'
                sh 'sudo docker ps'
                sh 'sudo docker build -t nest-app .'
                sh 'sudo docker rm nest -f'
                sh 'sudo docker run --name nest -p 3100:3100 --restart unless-stopped --network pos-app -d nest-app'
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