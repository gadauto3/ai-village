#!/bin/bash
cd frontend/
# Build will capture current git commit hash via webpack DefinePlugin
npm run build
cd ..
terraform apply -auto-approve
