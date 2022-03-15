pipeline {
  agent any 
//  triggers {
//        pollSCM(env.GIT_BRANCH == 'main' ? '* * * * *' : '')
//    }
  stages {
      stage('Checkout SCM') {
        steps{
          checkout scm
          sh "ls"
          sh "git --version"
          echo "Deployment TO ${env.GIT_BRANCH}"
          script {   env.DOCKER_REGISTRY = 'riskirinando'
                     env.DOCKER_IMAGE_NAME = 'calculator-bmi'
                     //#Change env DOCKER_IMAGE_APPS
                     env.DOCKER_IMAGE_APPS = 'calculator-bmi'
          }
        }
      }
      stage('Build Docker Image') {
        steps{
          script {
            sh "docker image build . -t $DOCKER_REGISTRY/$DOCKER_IMAGE_NAME:${BUILD_NUMBER}"
            sh "docker tag $DOCKER_REGISTRY/$DOCKER_IMAGE_NAME:${BUILD_NUMBER} $DOCKER_REGISTRY/$DOCKER_IMAGE_NAME:${BUILD_NUMBER}"
            echo "Docker Image ${BUILD_NUMBER} Build For Production ${currentBuild.currentResult}"
          }  
        }
      }
    
      stage('Push Docker Image') {
            steps {
                script {
                withCredentials([string(credentialsId: 'dockerhubpwd', variable: 'dockerhubpwd')]) {
                    sh 'docker login -u riskirinando -p ${dockerhubpwd}'
                }
                sh "docker push $DOCKER_REGISTRY/$DOCKER_IMAGE_NAME:${BUILD_NUMBER}"
                }
            }
      }
    
      stage('Docker Image Delete'){
        steps{
          script {
            sh "docker image rm -f $DOCKER_REGISTRY/$DOCKER_IMAGE_NAME:${BUILD_NUMBER}"
            echo "Docker Image ${BUILD_NUMBER} Delete For Production ${currentBuild.currentResult}"
          }  
        }
      }
    
      stage('Deploy to cluster'){
        steps{
          script {
            //#Change url wget
            sh 'wget https://raw.githubusercontent.com/riskirinando/happy-fresh-test/main/k8s/bmi-calculator/calculator-bmi.yaml?token=GHSAT0AAAAAABSMUTZ7YOU4736INKXDJXYKYRQSYGQ -P k8s/bmi-calculator/'
            sh 'sed -i "s/latest/$BUILD_NUMBER/g" k8s/bmi-calculator/calculator-bmi.yaml'
            sh 'kubectl apply -f k8s/bmi-calculator/calculator-bmi.yaml'
            sh 'rm -rf *'
            echo "Deploy ${BUILD_NUMBER} To Server Production ${currentBuild.currentResult}"
          }  
        }
      }
    }
  post {
        always {
          script {
            echo "DEPLOY NUMBER ${BUILD_NUMBER} TO PRODUCTION ${currentBuild.currentResult}"
          }  
        }
  }  
}
