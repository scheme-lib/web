;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;Copyright 2016-2080 evilbinary.
;;作者:evilbinary on 12/24/16.
;;邮箱:rootdebug@163.com
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(load "../packages/slib/slib.ss")
(import (net socket) (net socket-ffi )
	(json json)
	(cffi cffi)
	(c c-ffi) )

(require 'http)
(require 'cgi)
(require 'uri)


;;(cffi-log #t)

(define port 8080)
(define ip INADDR_ANY)
(define path "../apps/monitor")

(if (> (length (command-line)) 1)
    (if (not (eq? "" (cadr (command-line))))
	(set! port (string->number (cadr (command-line)))) ))
(if (> (length (command-line)) 2)
    (begin
      (set! ip (ntohl (inet-addr (caddr (command-line)) )))))

(if (> (length (command-line)) 3)
    (begin
      (set! path (cadddr (command-line)) )))

(printf "listen on %a %a %a\n" port  ip path)

(define all-router (make-hashtable equal-hash equal?) )

(define socket (make-socket AF_INET SOCK_STREAM port ip))

(define bind-ret (socket:bind socket))

(if (< bind-ret 0)
    (slib:error "bind erro ~a" bind-ret ))

(socket:listen socket)



(define-syntax try 
  (syntax-rules (catch) 
    ((_ body (catch catcher)) 
     (call-with-current-continuation 
      (lambda (exit) 
	(with-exception-handler 
	 (lambda (condition) 
	   (catcher condition) 
	   (exit condition)) 
	 (lambda () body)))))))

(define (readlines filename)
  (call-with-input-file filename
    (lambda (p)
      (let loop ((line (read-line p))
                 (result "" ))
        (if (eof-object? line)
	    (string-append result "" )
            (loop (read-line p)
		  (string-append result line http:crlf)))))))

(define (file->list-of-chars file)
  (with-input-from-file file
    (lambda ()
      (let reading ((chars '()))
        (let ((char (read-char)))
          (if (eof-object? char)
              (reverse chars)
              (reading (cons char chars))))))))


(define (file->chars path)
  (call-with-input-file path
    (lambda (input-port)
      (let loop ((x (read-char input-port)))
	(cond 
	 ((eof-object? x) '())
	 (#t (begin (cons x (loop (read-char input-port))))))))))


(define (save-file filename content)
  (let ((p (open-output-file filename 'replace)))
    (display content p)
    (close-output-port p)))
  

(define (get-content-type ext)
  (case ext
    [("js") "application/javascript"]
    [("html") "text/html"]
    [("css") "text/css"]
    [("jpg") "image/jpeg"]
    [("png") "image/png"]
    [else  "text/html"]))

(define json-ret
  (case-lambda
   [(data)
    (let ((hash (make-eq-hashtable)))
      (hashtable-set! hash 'code 0)
      (hashtable-set! hash 'message "success")
      (hashtable-set! hash 'result data)
      (http:content
       '(("Content-Type" . "application/json; charset=utf-8") ("Connection" . "close"))
       (scm->json-string hash)) )]

   [(code message data)
    (let ((hash (make-eq-hashtable)))
      (hashtable-set! hash 'code code)
      (hashtable-set! hash 'message message)
      (hashtable-set! hash 'result data)
      (http:content
       '(("Content-Type" . "application/json; charset=utf-8") ("Connection" . "close"))
       (scm->json-string hash)) )]
   ))



(define (decode string)
  (if (string-index string #\%)
      (call-with-output-string
       (lambda (port)
	 (let* ((end (string-length string))
		(bv (make-bytevector end 0) )
		(pos 0))
	   (let loop ((i 0))
	     (if (fx< i end)
		 (if (char=? (string-ref string i) #\%)
		     (begin
		       (bytevector-u8-set!
			bv pos
			(string->number
			 (substring string
				    (fx+ i 1)
				    (fx+ i 3)) 16 ))
		       (set! pos (+ pos 1))
		       (loop (fx+ i 3)))
		     (begin
		       ;;(printf "-->%a\n" (char->integer (string-ref string i)))
		       (bytevector-u8-set! bv pos (char->integer (string-ref string i)))
		       (set! pos (+ pos 1))
		       ;;(write-char (string-ref string i) port)
		       (loop (fx+ i 1))))
		 (begin		   
		   (let ((buff (make-bytevector pos)))
		     (bytevector-copy! bv 0 buff 0 pos)
		     (put-string port (utf8->string buff))) ) ))))) string))

(define (decode-query query-string)
  (set! query-string (string-subst query-string " " "" "+" " "))
  (do ((lst '())
       (edx (string-index query-string #\=)
	    (string-index query-string #\=)))
      ((not edx) lst)
    (let* ((rxt (substring query-string (+ 1 edx) (string-length query-string)))
	   (adx (string-index rxt #\&))
	   (urid (decode
		  (substring rxt 0 (or adx (string-length rxt)))))
	   (name (string-ci->symbol
		  (decode (substring query-string 0 edx)))))
      (if (not (equal? "" urid))
	  (set! lst (cons (list name urid) lst))
	  ;; (set! lst (append lst (map (lambda (value) (list name value))
	  ;; 			     (uri:split-fields urid #\newline))))
	  )
      (set! query-string
	    (if adx (substring rxt (+ 1 adx) (string-length rxt)) "")))))


(define (router! url process )
  (if (string? url)
      (hashtable-set! all-router  url process)
      (hashtable-set! all-router  (symbol->string url) process)))


(define (router url)
  (hashtable-ref all-router url '() ))

(router! '/api/save
	 (lambda (url params)
	   (printf "url=%a params=%a\n" url params)
	   (if (pair? params)
	       (let ((p (cadar params))
		     (name (cadadr params))
		     (text (car (cdaddr params))))
		 (if (string=? p "/pages/docs/md/")
		     (begin
		       (printf "save %a\n"  (string-append path p name ".md"))
		       (save-file (string-append path p name  ".md" ) text)))
		 (http:content
		  (list
		   (cons "Content-Type" "text/json") (cons "Connection" "close") )
		  (string-append "{ret:0,message:'success',result:null}"  http:crlf ) ) ))))

(router! '/api/file
	 (lambda (url params)
	   (printf "url=%a params=%a\n" url  params)
	   (if (pair? params)
	       (let* ((file (string-append  path (cadr (car params)) ".md" ))
		      (content ""))
		 (if (file-exists? file)
		     (begin
		       (set! content (readlines file))
		       (json-ret content))
		     (json-ret -1 "文件不存在" '())  )))))

(router! '/api/fileList
	 (lambda (url params)
	   (printf "url=%a params=%a\n" url  params)
	   (let* ((dir
		   (if (and params  (eqv? 'path (car (list-ref params 0))))
		       (cadr (list-ref params 0))
		       "/pages/docs/md/" ) )
		  (dirs
		   (directory-list (string-append path dir))))
	     (json-ret
	      (map
	       (lambda (file)
		 (let ((hash (make-eq-hashtable))
		       (isFolder (file-directory? (string-append path dir file)) ))
		   (hashtable-set! hash 'name (path-root file ))
		   (hashtable-set! hash 'open #f)
		   (hashtable-set! hash 'isFolder isFolder)
		   (hashtable-set! hash 'active #f)
		   (hashtable-set! hash 'path (string-append dir (if isFolder  (string-append file "/")  "") ))
		   (hashtable-set! hash 'children (list )) hash)) dirs)))))

(define (file-size file)
  (let ((f (c-fopen file "r"))
	(len 0))
     (c-fseek f 0 2)
     (set! len (c-ftell f))
     (c-fclose f)
     len))

(define (serve-proc request-line query-string header iport oport port)
  (printf "%a %a\n" (date-and-time) request-line)
  ;;(printf "path=%a\n" (cadr request-line))
  (let* ((url (caddr (uri:split (cadr request-line))))
	 (file (string-append path "/pages" url ))
	 (res (string-append path url))
	 (url-field (uri:split-fields url #\/))
	 (ext (car (reverse  (uri:split-fields url #\.))))
	 (type (get-content-type  ext))
	 )
    ;;(printf "file=%a res=%a\n" file res)
    ;;(printf "url-field=%a ext=>%a\n" url-field ext)
    
    (if (equal? (substring ext 0 1) "/")
	  (set! file (string-append file "index.html"))
	  (if (file-exists? res)
	      (set! file res)) )

    ;;(printf "url=%a file=%s\n" url file)
    (if (file-exists? file)
	(begin
	  
	  ;;(printf "url=%a type=%a file=%s len=%d\n"
	;;	   url type file
	;;	   (string-length (apply string (file->chars file)  )))
	   (printf "file type=%s len=%d\n" type  (file-size file) )
	   (if (or (string=? "image/jpeg" type)  (string=? "image/png" type))
	       (begin
		 
		 ;;(printf "image file\n")
		 (display (http:status-line 200 "OK" )oport)
		 (display (string-append "Content-Length:" (number->string (file-size file)  ) http:crlf) oport)
		 (display (string-append "Content-Type:" type http:crlf)  oport)
		 (display (string-append "Connection:" "close" http:crlf  http:crlf)  oport)

		 ;; (let ((pfr (open-file-input-port file)) )
		 ;;   (let loop((c (get-u8 pfr)))
		 ;;     (if (eof-object? c)
		 ;; 	 (begin
		 ;; 	   (close-input-port pfr))
		 ;; 	 (begin
		 ;; 	   ;;(printf "get-char=%a %a %a\n" c (char? c ) (integer->char c) )
		 ;; 	   (write-char  (integer->char c) oport)
		 ;; 	   (loop (get-u8 pfr))))))
		 
		 (let ((f (c-fopen file "rb"))
		       (buf (cffi-alloc 1024)))
		   (let loop ((len (c-fread buf 1 1024 f)))
		     (if (> len 0)
			 (begin	   
			   (cwrite-all port buf len)
			   (loop (c-fread buf 1 1024 f))  )
			 (c-fclose f ))))
		 '()
		 )
	       (let ((ret  ;(http:status-line 200 "")
		       (http:content
			(list
			 (cons "Content-Type" type)
			 (cons "Connection" "close") )
			(readlines file)
			) ))
		 ret))
	   
	   )
	 (if (procedure? (router url)) 
	     ((router url) url (if query-string (decode-query  query-string) query-string ))
	     (list 404 ""))
	 )
    ))


(let loop ((port (socket:accept socket) ) )
  (if (>= port 0)
      (begin 
	(let ((iport (make-fd-input-port port))
	      (oport (make-fd-output-port port)))
	  (http:serve-query
	   (lambda (request query header)
	     (try
	      (serve-proc request query header iport oport port)
	      (catch (lambda (x) 
		       (display-condition x) ))))
	     iport oport )
	   
	  ;; (close-port iport)
	  ;; (close-port oport)
	  (close port)
	  )
	(loop  (socket:accept socket))
	))
  )

(socket:close socket)

;;(printf "hello,world\n")
