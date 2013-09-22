require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'sinatra/reloader'
require 'Date'

get '/' do 
  # TODO
  # Populate list
  erb :index
end