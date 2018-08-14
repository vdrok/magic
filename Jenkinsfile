pipeline {
   agent any
   stages {
      stage('Build') {
         steps {
           sh 'docker build -t duo_apps_ci .'
         }
       }

       stage('Test Unit') {
           steps {
                sh 'docker run -v $(pwd)/testresults:/usr/src/app/test/ duo_apps_ci npm run test:ci'
                junit 'testresults/junit.xml'
           }
       }

      stage('Test Production Build') {
           steps {
              sh 'docker run  duo_apps_ci npm run web-bundle'

           }
      }



       stage('Push latest Docker image') {
                 when { branch 'master' }
                 steps {
                       withDockerRegistry([credentialsId: 'ecr:eu-west-1:6077a2e9-c106-4961-826b-eef40d810470', url: 'https://777778141469.dkr.ecr.eu-west-1.amazonaws.com']) {
                            sh 'docker tag duo_apps_ci:latest 777778141469.dkr.ecr.eu-west-1.amazonaws.com/duo_apps:latest'
                            sh 'docker push 777778141469.dkr.ecr.eu-west-1.amazonaws.com/duo_apps:latest'
                       }
                  }
           }
   }

   post {
       always {
            sh 'docker rmi duo_apps_ci --no-prune -f'
       }
   }
}