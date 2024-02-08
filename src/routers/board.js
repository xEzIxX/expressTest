import '../config/env.js'

import express from 'express'
import jwt from 'jsonwebtoken'
import { wrapper } from '../utils/wrapper.js'
import { BoardService } from '../services/board.js'
import { body } from 'express-validator'
import { validate } from '../utils/validate.js'
import { isPasswordValid } from '../utils/isPasswordValid.js'

export const boardRouter = express.Router()
const boardService = new BoardService()

// [ /board/post ] : get 글 조회, delete 글 삭제

boardRouter.get(
    '/post/:postId',
    // 글 조회
    wrapper(async (req, res) => {
        try {
            const postId = req.params.postId.split(':')[1]

            const post = await boardService.getPostById(postId) // 게시판 아이디 postId와 일치하는 글 갖고옴

            if (post.result === true) {
                return res.status(200).send(post) // 그 글 페이지의 데이터, 화면을 보여줘야함
            } else {
                return res.status(404).send(post)
            }
        } catch (err) {
            throw err
        }
    })
)

boardRouter.delete(
    '/post',
    // 글 삭제
    validate([
        body('postId').notEmpty(),
        body(
            'password',
            '비밀번호는 8자 이상, 대소문자, 숫자, 특수문자를 적어도 하나씩 포함해야합니다.'
        ).isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }),
        body('checkPw').isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }),
    ]),
    wrapper(async (req, res) => {
        try {
            const postId = req.body.postId
            const password = req.body.password

            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_AK_KEY)

            // 작성자의 password와 일치하여야 삭제 가능
            const isValid = isPasswordValid(decoded.user_id, password)

            if (isValid) {
                const deletion = await boardService.deleteBoardById(
                    postId,
                    decoded.user_id
                )
                if (deletion.result === true) {
                    return res.status(200).send(deletion)
                } else {
                    return res.status(404).send(deletion)
                }
            } else {
                return res.status(401).send('권한 없음')
            }
        } catch (err) {
            throw err
        }
    })
)

// [ /board/post/form ] : get 글 작성, post 글 작성
boardRouter.get(
    '/post/form',
    wrapper(async (req, res) => {
        try {
            return res.send('postForm.ejs')
        } catch (err) {
            throw err
        }
    })
)

boardRouter.post(
    '/post/form',
    validate([body('title').notEmpty(), body('content').notEmpty()]),
    wrapper(async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_AK_KEY)

            const postDto = {
                title: req.body.title,
                content: req.body.content,
                userid: decoded.user_id,
            }

            const createdPost = await boardService.createNewPost(postDto) // 작성된 글 저장 서비스 함수

            if (createdPost.result === true) {
                return res.status(201).json(createdPost.message)
            } else {
                return res.status(400).json(createdPost.message)
            }
        } catch (err) {
            console.log(err)
            throw err
        }
    })
)

// [ /board/edit ] : get 글 편집, put 글 편집
boardRouter.get(
    '/post/edit',
    validate([body('postId').notEmpty()]),
    wrapper(async (req, res) => {
        try {
            const postId = req.body.postId

            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_AK_KEY)

            const original = await boardService.getOriginalPostById(postId)

            if (decoded.user_id === original.board_user_id) {
                return res.status(200).send(original)
                // return res.status(200).render('edit.ejs', {result: original})
            } else {
                return res.status(401).send('권한없음')
            }
        } catch (err) {
            throw err
        }
    })
)

boardRouter.put(
    '/post/edit',
    // 글 편집
    validate([
        body('postId').notEmpty(),
        body('title').notEmpty(),
        body('content').notEmpty(),
    ]),
    wrapper(async (req, res) => {
        try {
            const updateResult = await boardService.updatePostById(
                req.body.postId,
                req.body.title,
                req.body.content
            )

            if (updateResult.result) {
                return res.status(201).send(updateResult)
            } else {
                return res.status(404).send(updateResult)
            }
        } catch (err) {
            throw err
        }
    })
)
