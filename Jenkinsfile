pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                    sh '''
                        eval "$(ssh-agent -s)"
                        ls -l /
                        cat /tmp/id_rsa
                        echo "akudiaya" | ssh-add /tmp/id_rsa
                        ssh fajarnurwahid99@35.219.71.84 "cd ~/pos-app/nest-pos-be; git pull origin master; docker build -t nestjs-app .; docker compose down; docker compose up -d; docker image prune -a -f"
                    '''
            }
        }
    }
}
