#!/bin/bash
echo $(pwd)
cd backend/nodejs
pwd
npm test $*
