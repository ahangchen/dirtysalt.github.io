;;; we need environment at first
(load "~/.emacs") 
;;; then we do action
(require 'ox-publish)
(org-publish-project "site")
