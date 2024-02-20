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

// [ /board/form ] : get 글 작성, board 글 작성
boardRouter.get(
    '/board/form',
    wrapper(async (req, res) => {
        try {
            return res.render('board/form.ejs')
        } catch (err) {
            throw err
        }
    })
)

boardRouter.post(
    '/board/form',
    validate([body('title').notEmpty(), body('content').notEmpty()]),
    wrapper(async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            const boardDto = {
                title: req.body.title,
                content: req.body.content,
                userid: decoded.userId,
            }

            const createdBoard = await boardService.createNewBoard(boardDto) // 작성된 글 저장 서비스 함수

            if (createdBoard.result === true) {
                return res.status(201).send(createdBoard)
            } else {
                return res.status(400).send(createdBoard)
            }
        } catch (err) {
            throw err
        }
    })
)

// [ /board/edit ] : get 글 수정, put 글 수정
boardRouter.get(
    '/board/edit',
    validate([body('boardId').notEmpty()]),
    wrapper(async (req, res) => {
        try {
            const boardId = req.body.boardId

            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            const original = await boardService.getOriginalBoardById(boardId)

            if (decoded.userId === original.board_user_id) {
                return res.status(200).send(original)
                // return res.status(200).render('board/edit.ejs', {result: original})
            } else {
                return res.status(401).send({message : '권한없음'})
            }
        } catch (err) {
            throw err
        }
    })
)

boardRouter.put(
    '/board/edit',
    // 글 수정
    validate([
        body('boardId').notEmpty(),
        body('title').notEmpty(),
        body('content').notEmpty(),
    ]),
    wrapper(async (req, res) => {
        try {
            const updateResult = await boardService.updateBoardById(
                req.body.boardId,
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

// [ /board ] : get 글 조회

boardRouter.get(
    '/board/:boardId',
    // 글 조회
    wrapper(async (req, res) => {
        try {
            const boardId = req.params.boardId.split(':')[1]

            const board = await boardService.getBoardById(boardId) // 게시판 아이디 boardId와 일치하는 글 갖고옴

            if (board.result === true) {
                return res.status(200).send(board) // 그 글 페이지의 데이터, 화면을 보여줘야함
            } else {
                return res.status(404).send(board)
            }
        } catch (err) {
            throw err
        }
    })
)

boardRouter.delete(
    '/board',
    // 글 삭제
    validate([
        body('boardId').notEmpty(),
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
            const boardId = req.body.boardId
            const password = req.body.password

            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            // 작성자의 password와 일치하여야 삭제 가능
            const isValid = isPasswordValid(decoded.userId, password)

            if (isValid) {
                const deletion = await boardService.deleteBoardById(
                    boardId,
                    decoded.userId
                )
                if (deletion.result === true) {
                    return res.status(200).send(deletion)
                } else {
                    return res.status(404).send(deletion)
                }
            } else {
                return res.status(401).send({message : '권한 없음'})
            }
        } catch (err) {
            throw err
        }
    })
)
