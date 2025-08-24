#!/bin/bash

# TaskFlow Quick Deployment Script
# This script provides quick commands for deploying and managing the TaskFlow application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if docker-compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "docker-compose is not installed. Please install it and try again."
        exit 1
    fi
    print_success "docker-compose is available"
}

# Function to build and start services
deploy() {
    print_status "Building and starting TaskFlow services..."
    
    # Build and start all services
    docker-compose up -d --build
    
    print_success "Services started successfully!"
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    check_health
}

# Function to stop services
stop() {
    print_status "Stopping TaskFlow services..."
    docker-compose down
    print_success "Services stopped successfully!"
}

# Function to restart services
restart() {
    print_status "Restarting TaskFlow services..."
    docker-compose restart
    print_success "Services restarted successfully!"
}

# Function to check service health
check_health() {
    print_status "Checking service health..."
    
    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        print_success "All services are running"
    else
        print_error "Some services are not running"
        docker-compose ps
        exit 1
    fi
    
    # Health checks
    print_status "Running health checks..."
    
    # Caddy health
    if curl -f http://localhost/health > /dev/null 2>&1; then
        print_success "Caddy is healthy"
    else
        print_warning "Caddy health check failed"
    fi
    
    # Backend health
    if curl -f http://localhost/api/health > /dev/null 2>&1; then
        print_success "Backend API is healthy"
    else
        print_warning "Backend API health check failed"
    fi
    
    # Frontend health
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        print_success "Frontend is healthy"
    else
        print_warning "Frontend health check failed"
    fi
}

# Function to view logs
logs() {
    local service=${1:-""}
    
    if [ -z "$service" ]; then
        print_status "Showing logs for all services..."
        docker-compose logs -f
    else
        print_status "Showing logs for $service service..."
        docker-compose logs -f "$service"
    fi
}

# Function to update services
update() {
    print_status "Updating TaskFlow services..."
    
    # Pull latest changes
    git pull origin main
    
    # Stop services
    stop
    
    # Build and start with latest changes
    deploy
    
    print_success "Update completed successfully!"
}

# Function to reset everything
reset() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Resetting everything..."
        
        # Stop and remove everything
        docker-compose down -v
        
        # Remove all images
        docker system prune -a -f
        
        print_success "Reset completed successfully!"
    else
        print_status "Reset cancelled"
    fi
}

# Function to show status
status() {
    print_status "TaskFlow service status:"
    docker-compose ps
    
    echo ""
    print_status "Resource usage:"
    docker stats --no-stream
}

# Function to show help
show_help() {
    echo "TaskFlow Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy      Build and start all services"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  health      Check service health"
    echo "  logs [SERVICE] Show logs (all services or specific service)"
    echo "  update      Pull latest changes and redeploy"
    echo "  reset       Remove all containers, volumes, and images"
    echo "  status      Show service status and resource usage"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy          # Deploy the application"
    echo "  $0 logs backend    # Show backend logs"
    echo "  $0 health          # Check service health"
}

# Main script logic
main() {
    # Check prerequisites
    check_docker
    check_docker_compose
    
    # Parse command
    case "${1:-help}" in
        deploy)
            deploy
            ;;
        stop)
            stop
            ;;
        restart)
            restart
            ;;
        health)
            check_health
            ;;
        logs)
            logs "$2"
            ;;
        update)
            update
            ;;
        reset)
            reset
            ;;
        status)
            status
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
