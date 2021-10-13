pipeline {
    options {
      timeout(time: 1, activity: false, unit: 'HOURS') 
    }
    agent any
     tools {
        nodejs "node"
    }
    stages {
        stage('Build') {
            steps {
              //  sh 'sudo su'
               sh 'ls -al'
            }
        }

        
        stage('Deploy') {
                steps {
                    sshPublisher(
                        publishers: [sshPublisherDesc(configName: 'javascript development server',
                            transfers: [
                                sshTransfer(cleanRemote: false, 
                                excludes: '', 
                                execCommand: 'cd /var/www/html/Chefk-Core/ && docker-compose down && docker image prune -af && docker-compose pull && docker-compose up -d',
                                execTimeout: 120000, 
                                flatten: false, 
                                makeEmptyDirs: false, 
                                noDefaultExcludes: false, 
                                patternSeparator: '[, ]+')
                                // remoteDirectory: '/var/www/html/chefk-frontend/', 
                                // remoteDirectorySDF: false, 
                                // removePrefix: 'dist/',
                                // sourceFiles: 'dist/**/*')
                            ], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])

            }
            
        }
    }
}
