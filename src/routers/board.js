import '../config/env.js'

import express from 'express'
import { wrapper } from '../utils/wrapper.js'
import { BoardService } from '../services/board.js'
import { body } from 'express-validator'
import { validate } from '../utils/validate.js'

export const boardRouter = express.Router()
const boardService = new BoardService()

boardRouter.get(
    // 게시글 리스트 페이지 조회
    '/',
    wrapper(async (req, res) => {
        const isToken = Boolean(req.userId)
        const foundAllBoard = await boardService.findAllBoard() // 모든 게시글 반환 서비스 함수

        if (foundAllBoard.result === true) {
            return res.status(200).render('board/list.ejs', {
                result: foundAllBoard,
                isToken,
            })
        } else {
            return res.status(500).render('board/list.ejs', {
                result: foundAllBoard,
                isToken,
            })
        }
    })
)

boardRouter.get(
    // 검색,정렬된 게시글 리스트 페이지 조회
    '/search',
    wrapper(async (req, res) => {
        const isToken = Boolean(req.userId)

        const queryDto = {
            q: req.query.q,
            sort: req.query.sort,
        }
        const searchedList = await boardService.searchList(queryDto)

        if (searchedList.result === true) {
            return res.status(200).render('board/list.ejs', {
                result: searchedList,
                isToken,
            })
        } else {
            return res.status(500).render('board/list.ejs', {
                result: searchedList,
                isToken,
            })
        }
    })
)

/* [ /board/form ] 게시글 작성 */

boardRouter.get(
    // 게시글 작성 폼 조회
    '/form',
    wrapper(async (req, res) => {
        // console.log('게시글 작성 폼 조회 req.userId : ', req.userId)
        const isToken = Boolean(req.userId)

        const formAuthDto = {
            userId: req.userId,
            tokenMsg: req.tokenErrMsg,
        }

        const checedkFormAuth = await boardService.checkFormAuth(formAuthDto)

        if (checedkFormAuth.result === true) {
            return res.status(200).render('board/form.ejs', {
                result: checedkFormAuth,
                isToken,
            })
        } else {
            return res.status(401).render('board/form.ejs', {
                result: checedkFormAuth,
                isToken,
            })
        }
    })
)

boardRouter.post(
    // 작성한 게시글 저장
    '/form',
    validate([body('title').notEmpty(), body('content').notEmpty()]),
    wrapper(async (req, res) => {
        // console.log('작성한 게시글 저장  req.userId : ', req.userId)

        const newBoardDto = {
            title: req.body.title,
            content: req.body.content,
            userId: req.userId,
            tokenMsg: req.tokenErrMsg || null,
        }

        const createdBoard = await boardService.createBoard(newBoardDto) // 작성한 글 저장 서비스 함수

        if (createdBoard.result === true) {
            return res.status(200).send(createdBoard)
        } else {
            return res.status(500).send(createdBoard)
        }
    })
)

/* [ /board/:boardId/edit ] 게시글 수정 */

boardRouter.get(
    // 수정 권한이 있다면 게시글 수정 페이지 조회
    '/:boardId/edit',
    wrapper(async (req, res) => {
        // console.log('수정 페이지 조회 라우터 :' + req.userId)
        const isToken = Boolean(req.userId)

        const accessCheckDto = {
            userId: req.userId,
            tokenMsg: req.tokenErrMsg || null,
            boardId: req.params.boardId.split(':')[1],
        }

        const foundOriginal = await boardService.getOriginalById(accessCheckDto)

        // console.log('라우터에서 최종 전달 객체 : ', foundOriginal)
        if (foundOriginal.result === true) {
            return res.status(200).render('board/edit.ejs', {
                result: foundOriginal,
                isToken,
            })
        } else {
            return res.status(401).render('board/edit.ejs', {
                result: foundOriginal,
                isToken,
            })
        }
    })
)

boardRouter.put(
    // 수정된 게시글 데이터 저장
    '/:boardId/edit',
    validate([body('title').notEmpty(), body('content').notEmpty()]),
    wrapper(async (req, res) => {
        const updatedBoardDto = {
            boardId: req.params.boardId.split(':')[1],
            title: req.body.title,
            content: req.body.content,
        }
        const updatedBoard = await boardService.updateBoardById(updatedBoardDto)

        if (updatedBoard.result === true) {
            return res.status(200).send(updatedBoard)
        } else {
            return res.status(404).send(updatedBoard)
        }
    })
)

/* [ /board/:boardId ] 게시글 조회 */

boardRouter.get(
    // 게시글 아이디가 boardId인 게시글 조회
    '/:boardId',
    wrapper(async (req, res) => {
        const isToken = Boolean(req.userId)

        const boardIdDto = {
            userId: req.userId,
            boardId: req.params.boardId.split(':')[1],
        }
        const foundBoard = await boardService.getBoardById(boardIdDto) // 게시글 아이디 boardId와 일치하는 조회할 게시글

        if (foundBoard.result === true) {
            return res.status(200).render('board/board.ejs', {
                result: foundBoard,
                isToken,
            })
        } else {
            return res.status(404).render('board/board.ejs', {
                result: foundBoard,
                isToken,
            })
        }
    })
)

boardRouter.delete(
    // 게시글 아이디가 boardId인 게시글 삭제
    '/:boardId',
    wrapper(async (req, res) => {
        // console.log(req.userId)

        const accessCheckDto = {
            userId: req.userId,
            tokenMsg: req.tokenErrMsg || null,
            boardId: req.params.boardId.split(':')[1],
        }

        const deletedBoard = await boardService.deleteBoardById(accessCheckDto)

        if (deletedBoard.result === true) {
            return res.status(200).send(deletedBoard)
        } else {
            return res.status(403).send(deletedBoard)
        }
    })
)

boardRouter.get(
    // 현재 유저가 조회 중인 게시글의 '좋아요' 여부 조회
    '/:boardId/like',
    wrapper(async (req, res) => {
        const boardIdDto = {
            userId: req.userId,
            boardId: req.params.boardId.split(':')[1],
        }

        const checkedLike = await boardService.checkLike(boardIdDto)

        if (checkedLike.result === true) {
            return res.status(200).send(checkedLike)
        } else {
            return res.status(500).send(checkedLike)
        }
    })
)

boardRouter.post(
    // 현재 유저의 게시글 '좋아요' 정보 저장
    '/:boardId/like',
    wrapper(async (req, res) => {
        const boardIdDto = {
            userId: req.userId,
            boardId: req.params.boardId.split(':')[1],
        }

        const likedBoard = await boardService.likeBoard(boardIdDto)

        if (likedBoard.result === true) {
            return res.status(200).send(likedBoard)
        } else {
            return res.status(500).send(likedBoard)
        }
    })
)

boardRouter.delete(
    // 현재 유저의 게시글 '좋아요' 삭제
    '/:boardId/like',
    wrapper(async (req, res) => {
        const accessCheckDto = {
            userId: req.userId,
            tokenMsg: req.tokenErrMsg || null,
            boardId: req.params.boardId.split(':')[1],
        }

        const deleted = await boardService.deleteLike(accessCheckDto)

        if (deleted.result === true) {
            return res.status(200).send(deleted)
        } else {
            return res.status(500).send(deleted)
        }
    })
)

boardRouter.get(
    // 현재 유저가 조회 중인 게시글 작성자 '팔로우' 여부 조회
    '/:boardId/follow',
    wrapper(async (req, res) => {
        const boardIdDto = {
            userId: req.userId,
            boardId: req.params.boardId.split(':')[1],
        }

        const checkedfollow = await boardService.checkfollow(boardIdDto)

        if (checkedfollow.result === true) {
            return res.status(200).send(checkedfollow)
        } else {
            return res.status(500).send(checkedfollow)
        }
    })
)

boardRouter.post(
    // 현재 유저의 게시글 작성자 '팔로우' 정보 저장
    '/:boardId/follow',
    wrapper(async (req, res) => {
        const boardIdDto = {
            userId: req.userId,
            boardId: req.params.boardId.split(':')[1],
        }

        const followedUser = await boardService.followUser(boardIdDto)

        if (followedUser.result === true) {
            return res.status(200).send(followedUser)
        } else {
            return res.status(500).send(followedUser)
        }
    })
)

boardRouter.delete(
    // 현재 유저의 '게시글 작성자 팔로우' 삭제
    '/:boardId/follow',
    wrapper(async (req, res) => {
        const accessCheckDto = {
            userId: req.userId,
            tokenMsg: req.tokenErrMsg || null,
            boardId: req.params.boardId.split(':')[1],
        }

        const deleted = await boardService.deleteFollow(accessCheckDto)

        if (deleted.result === true) {
            return res.status(200).send(deleted)
        } else {
            return res.status(500).send(deleted)
        }
    })
)
