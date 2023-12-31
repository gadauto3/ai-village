provider "aws" {
  region = local.region
}

resource "random_pet" "app_name" {}
resource "random_pet" "backend_name" {}

locals {
  stage_name = "dev"
  region = "us-east-1"

  app_name = random_pet.app_name.id
  api_name = random_pet.backend_name.id

  tags = {
    Name = "${local.app_name}-${local.stage_name}"
  }
}

module "app" {
  source     = "../terraform/"
  name       = local.app_name
  stage_name = local.stage_name

  frontend = {
    path = "/"

    description = "AI Village Frontend"
    entrypoint  = "index.html"
    source      = "${path.module}/frontend/public"
  }

  backend = {
    path = "/api"

    name        = local.api_name
    description = "AI Village backend"

    source     = "${data.archive_file.backend.output_path}"
    entrypoint = "index.handler"
    runtime    = "nodejs16.x"
    memory_mb  = 128

    api_key_path = "/aivillage/apikeys/openai"

    modules = [{
      source  = "${data.archive_file.modules.output_path}"
      runtime = "nodejs16.x"
    }]
  }

  enable_access_logging    = true
  enable_execution_logging = true

  tags = local.tags

  depends_on = [
    data.archive_file.backend,
    data.archive_file.modules
  ]
}

data "archive_file" "backend" {
  type = "zip"

  source_dir  = "${path.module}/backend/nodejs"
  excludes    = setunion(fileset("${path.module}/backend/nodejs", "node_modules/**"))
  output_path = "${path.module}/backend.zip"
}

data "archive_file" "modules" {
  type = "zip"

  source_dir  = "${path.module}/backend/"
  excludes    = ["nodejs/index.js", "nodejs/package-lock.json", "nodejs/package.json"]
  output_path = "${path.module}/layer.zip"
}

output "frontend_storage" {
  value = module.app.frontend_storage
}

output "deployment" {
  value = module.app.deployment
}
